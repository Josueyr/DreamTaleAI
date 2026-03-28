using DreamTaleAI.Core.DTOs;
using DreamTaleAI.Core.Interfaces;

namespace DreamTaleAI.Infrastructure.AI.Mock;

public class MockVisionService : IVisionService
{
    private static readonly string[] Ages = { "5", "6", "7", "8", "9", "10" };
    private static readonly string[] Characters = { "dragon", "conejo", "robot", "unicornio", "gato", "perro", "dinosaurio" };

    public Task<DrawingResponse> RecognizeAgeAsync(string imageBase64)
    {
        var random = new Random();
        var age = Ages[random.Next(Ages.Length)];
        return Task.FromResult(new DrawingResponse
        {
            Success = true,
            DetectedValue = age,
            Confidence = 0.85 + random.NextDouble() * 0.15
        });
    }

    public Task<DrawingResponse> RecognizeCharacterAsync(string imageBase64)
    {
        var random = new Random();
        var character = Characters[random.Next(Characters.Length)];
        return Task.FromResult(new DrawingResponse
        {
            Success = true,
            DetectedValue = character,
            Confidence = 0.80 + random.NextDouble() * 0.20
        });
    }
}
