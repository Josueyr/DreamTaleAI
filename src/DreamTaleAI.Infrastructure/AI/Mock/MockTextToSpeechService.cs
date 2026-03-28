using DreamTaleAI.Core.Interfaces;

namespace DreamTaleAI.Infrastructure.AI.Mock;

public class MockTextToSpeechService : ITextToSpeechService
{
    public Task<string> SynthesizeAsync(string text, string language = "es-ES")
    {
        // El frontend usa Web Speech API, este mock retorna vacío
        return Task.FromResult(string.Empty);
    }
}
