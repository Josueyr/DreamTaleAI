using DreamTaleAI.Core.Models;

namespace DreamTaleAI.Core.Interfaces;

public interface IStoryGeneratorService
{
    Task<Story> GenerateStoryAsync(int age, string character, string emotion);
    Task<string> GenerateVisualStyleAsync(string character, string emotion, string storyTitle);
}
