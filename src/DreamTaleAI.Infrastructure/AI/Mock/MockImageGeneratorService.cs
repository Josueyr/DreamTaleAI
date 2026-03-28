using DreamTaleAI.Core.Interfaces;

namespace DreamTaleAI.Infrastructure.AI.Mock;

public class MockImageGeneratorService : IImageGeneratorService
{
    public Task<string> GenerateImageAsync(string prompt)
    {
        // Retorna una URL de imagen placeholder
        var encoded = Uri.EscapeDataString(prompt);
        return Task.FromResult($"/api/images/placeholder?prompt={encoded}");
    }
}
