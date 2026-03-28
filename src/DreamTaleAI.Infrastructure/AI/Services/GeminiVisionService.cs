using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using DreamTaleAI.Core.DTOs;
using DreamTaleAI.Core.Interfaces;

namespace DreamTaleAI.Infrastructure.AI.Services;

public class GeminiVisionService : IVisionService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string Model = "gemini-2.5-flash";

    public GeminiVisionService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<DrawingResponse> RecognizeAgeAsync(string imageBase64)
    {
        var prompt = "Look at this drawing made by a child who tried to write a number (their age). " +
                     "What number did they draw? " +
                     "Reply ONLY with a JSON object, no markdown, no explanation: " +
                     "{\"value\": \"7\", \"confidence\": 0.9} " +
                     "where value is the detected digit as a string. " +
                     "If unclear, make your best guess between 3 and 12.";

        var content = await CallGeminiVision(imageBase64, prompt);
        if (content == null)
            return new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 };

        // Intentar parsear JSON
        var result = TryParseJson(content);
        if (result != null) return result;

        // Fallback: buscar un número en el texto
        var match = Regex.Match(content, @"\b([3-9]|1[0-2]|[1-2])\b");
        if (match.Success)
            return new DrawingResponse { Success = true, DetectedValue = match.Value, Confidence = 0.7 };

        return new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 };
    }

    public async Task<DrawingResponse> RecognizeCharacterAsync(string imageBase64)
    {
        var prompt = "Look at this drawing made by a child. They drew a character (animal, creature, robot, etc.). " +
                     "What did they draw? " +
                     "Reply ONLY with a JSON object, no markdown, no explanation: " +
                     "{\"value\": \"dragon\", \"confidence\": 0.9} " +
                     "where value is the character name in Spanish (1-2 words, lowercase). " +
                     "If the drawing is inappropriate: {\"value\": \"\", \"confidence\": 0, \"inappropriate\": true, \"message\": \"Dibujo inapropiado\"}";

        var content = await CallGeminiVision(imageBase64, prompt);
        if (content == null)
            return new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 };

        var result = TryParseJson(content);
        if (result != null) return result;

        // Fallback: usar lo que diga la respuesta como personaje
        var cleaned = content.Trim().ToLower().Split('\n')[0].Trim();
        if (!string.IsNullOrEmpty(cleaned) && cleaned.Length < 30)
            return new DrawingResponse { Success = true, DetectedValue = cleaned, Confidence = 0.6 };

        return new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 };
    }

    private async Task<string?> CallGeminiVision(string imageBase64, string prompt)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={_apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    parts = new object[]
                    {
                        new { text = prompt },
                        new { inline_data = new { mime_type = "image/png", data = imageBase64 } }
                    }
                }
            },
            generationConfig = new { temperature = 0.1, maxOutputTokens = 150, thinkingConfig = new { thinkingBudget = 0 } }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode) return null;

        using var doc = JsonDocument.Parse(responseBody);
        var parts = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts");

        // gemini-2.5-flash tiene thinking: iterar partes y tomar la última con texto real
        string? result = null;
        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("thought", out var thought) && thought.GetBoolean())
                continue; // saltar partes de razonamiento interno
            if (part.TryGetProperty("text", out var textProp))
                result = textProp.GetString();
        }
        return result;
    }

    private static DrawingResponse? TryParseJson(string content)
    {
        // Quitar bloques markdown ```json ... ```
        var stripped = Regex.Replace(content, @"```[a-z]*\s*|\s*```", "").Trim();

        var start = stripped.IndexOf('{');
        var end = stripped.LastIndexOf('}');
        if (start == -1 || end == -1) return null;

        try
        {
            using var parsed = JsonDocument.Parse(stripped[start..(end + 1)]);
            var root = parsed.RootElement;

            var inappropriate = root.TryGetProperty("inappropriate", out var inapp) && inapp.GetBoolean();
            if (inappropriate)
            {
                return new DrawingResponse
                {
                    Success = false,
                    DetectedValue = "",
                    Confidence = 0,
                    Inappropriate = true,
                    ModerationMessage = root.TryGetProperty("message", out var msg) ? msg.GetString() : "Dibujo inapropiado"
                };
            }

            var value = root.TryGetProperty("value", out var v) ? v.GetString() ?? "" : "";
            var confidence = root.TryGetProperty("confidence", out var c) ? c.GetDouble() : 0.8;

            return new DrawingResponse
            {
                Success = !string.IsNullOrEmpty(value),
                DetectedValue = value,
                Confidence = confidence
            };
        }
        catch
        {
            return null;
        }
    }
}
