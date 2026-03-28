namespace DreamTaleAI.Core.Interfaces;

public interface ITextToSpeechService
{
    Task<string> SynthesizeAsync(string text, string language = "es-ES");
}
