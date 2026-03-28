using System.Text;
using System.Text.Json;
using DreamTaleAI.Core.Interfaces;
using DreamTaleAI.Core.Models;

namespace DreamTaleAI.Infrastructure.AI.Services;

public class GeminiStoryGeneratorService : IStoryGeneratorService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;
    private const string Model = "gemini-2.5-flash";

    public GeminiStoryGeneratorService(HttpClient httpClient, string apiKey)
    {
        _httpClient = httpClient;
        _apiKey = apiKey;
    }

    public async Task<Story> GenerateStoryAsync(int age, string character, string emotion)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={_apiKey}";

        var prompt = $@"Eres un escritor de cuentos infantiles. Crea un cuento corto y mágico para un niño de {age} años.
El protagonista es un {character} que se siente {emotion}.
El cuento debe tener exactamente 4 páginas, con lenguaje simple y positivo.

Responde ÚNICAMENTE con JSON válido sin markdown:
{{""title"":""Título del cuento"",""pages"":[{{""pageNumber"":1,""text"":""Texto página 1 (2-3 oraciones).""}},{{""pageNumber"":2,""text"":""Texto página 2.""}},{{""pageNumber"":3,""text"":""Texto página 3.""}},{{""pageNumber"":4,""text"":""Final feliz página 4.""}}]}}";

        var requestBody = new
        {
            contents = new[]
            {
                new { parts = new[] { new { text = prompt } } }
            },
            generationConfig = new
            {
                temperature = 0.8,
                maxOutputTokens = 1000,
                thinkingConfig = new { thinkingBudget = 0 }
            }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return GetFallbackStory(age, character, emotion);

        using var doc = JsonDocument.Parse(responseBody);
        var parts = doc.RootElement
            .GetProperty("candidates")[0]
            .GetProperty("content")
            .GetProperty("parts");

        string content = "";
        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("thought", out var thought) && thought.GetBoolean())
                continue;
            if (part.TryGetProperty("text", out var textProp))
                content = textProp.GetString() ?? "";
        }

        var start = content.IndexOf('{');
        var end = content.LastIndexOf('}');
        if (start == -1 || end == -1)
            return GetFallbackStory(age, character, emotion);

        using var parsed = JsonDocument.Parse(content[start..(end + 1)]);
        var root = parsed.RootElement;

        var title = root.GetProperty("title").GetString() ?? $"La aventura de {character}";
        var pages = new List<StoryPage>();

        foreach (var page in root.GetProperty("pages").EnumerateArray())
        {
            var pageNumber = page.GetProperty("pageNumber").GetInt32();
            pages.Add(new StoryPage
            {
                PageNumber = pageNumber,
                Text = page.GetProperty("text").GetString() ?? "",
                ImageUrl = $"/api/images/placeholder?page={pageNumber}"
            });
        }

        return new Story { Title = title, Pages = pages };
    }

    public async Task<string> GenerateVisualStyleAsync(string character, string emotion, string storyTitle)
    {
        var url = $"https://generativelanguage.googleapis.com/v1beta/models/{Model}:generateContent?key={_apiKey}";

        var prompt = $"Describe in one short sentence (max 30 words) the visual appearance of a {character} character for a children's book illustration. " +
                     $"Include: body color, distinctive features, and overall look. " +
                     $"The character feels {emotion} in the story \"{storyTitle}\". " +
                     $"Reply ONLY with the description, no JSON, no markdown.";

        var requestBody = new
        {
            contents = new[] { new { parts = new[] { new { text = prompt } } } },
            generationConfig = new { temperature = 0.3, maxOutputTokens = 60, thinkingConfig = new { thinkingBudget = 0 } }
        };

        var json = JsonSerializer.Serialize(requestBody);
        var request = new HttpRequestMessage(HttpMethod.Post, url);
        request.Content = new StringContent(json, Encoding.UTF8, "application/json");

        var response = await _httpClient.SendAsync(request);
        var responseBody = await response.Content.ReadAsStringAsync();

        if (!response.IsSuccessStatusCode)
            return $"a cute friendly {character}";

        using var doc = JsonDocument.Parse(responseBody);
        var parts = doc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts");
        string description = $"a cute friendly {character}";
        foreach (var part in parts.EnumerateArray())
        {
            if (part.TryGetProperty("thought", out var thought) && thought.GetBoolean()) continue;
            if (part.TryGetProperty("text", out var t)) description = t.GetString() ?? description;
        }
        return description.Trim();
    }

    private static Story GetFallbackStory(int age, string character, string emotion) => new()
    {
        Title = $"La aventura de {character}",
        Pages = new List<StoryPage>
        {
            new() { PageNumber = 1, Text = $"Había una vez un {character} de {age} años que se sentía muy {emotion}.", ImageUrl = "/api/images/placeholder?page=1" },
            new() { PageNumber = 2, Text = $"El {character} decidió emprender una gran aventura.", ImageUrl = "/api/images/placeholder?page=2" },
            new() { PageNumber = 3, Text = $"En el camino encontró muchos amigos maravillosos.", ImageUrl = "/api/images/placeholder?page=3" },
            new() { PageNumber = 4, Text = $"Al final, el {character} aprendió que la amistad lo es todo. ¡Fin!", ImageUrl = "/api/images/placeholder?page=4" }
        }
    };
}
