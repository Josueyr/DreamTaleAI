using System.Text;
using System.Text.Json;
using DreamTaleAI.Core.Interfaces;

namespace DreamTaleAI.Infrastructure.AI.Services;

public class GeminiImageGeneratorService : IImageGeneratorService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public GeminiImageGeneratorService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<string> GenerateImageAsync(string prompt)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key={_apiKey}";

        var fullPrompt = $"Colorful children's book illustration, cartoon style, safe for kids, vibrant colors, no text, no words, no letters: {prompt}";
        const string negativePrompt = "text, words, letters, numbers, captions, watermark, typography, writing, signs, labels, subtitles, title, font, alphabet, readable text, inscriptions";

        var requestBody = new
        {
            instances = new[] { new { prompt = fullPrompt, negativePrompt } },
            parameters = new { sampleCount = 1 }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return "/api/images/placeholder";

        using var doc = JsonDocument.Parse(responseBody);
        var base64 = doc.RootElement
            .GetProperty("predictions")[0]
            .GetProperty("bytesBase64Encoded")
            .GetString();

        if (string.IsNullOrEmpty(base64))
            return "/api/images/placeholder";

        return $"data:image/png;base64,{base64}";
    }
}
