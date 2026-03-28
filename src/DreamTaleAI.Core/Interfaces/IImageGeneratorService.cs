namespace DreamTaleAI.Core.Interfaces;

public interface IImageGeneratorService
{
    Task<string> GenerateImageAsync(string prompt);
}
