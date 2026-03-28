using DreamTaleAI.Core.Interfaces;
using DreamTaleAI.Core.Models;

namespace DreamTaleAI.Infrastructure.AI.Services;

public class StoryOrchestrator
{
    private readonly IStoryGeneratorService _storyGenerator;
    private readonly IImageGeneratorService _imageGenerator;

    public StoryOrchestrator(IStoryGeneratorService storyGenerator, IImageGeneratorService imageGenerator)
    {
        _storyGenerator = storyGenerator;
        _imageGenerator = imageGenerator;
    }

    public async Task<Story> CreateStoryAsync(int age, string character, string emotion)
    {
        var story = await _storyGenerator.GenerateStoryAsync(age, character, emotion);

        // Generar descripción visual consistente del personaje
        var visualStyle = await _storyGenerator.GenerateVisualStyleAsync(character, emotion, story.Title);

        // Generar imagen para cada página en paralelo con el mismo estilo visual
        var imageTasks = story.Pages.Select(page =>
            _imageGenerator.GenerateImageAsync(
                $"Scene: {page.Text} " +
                $"Main character: {visualStyle}. " +
                $"Story: \"{story.Title}\". " +
                $"Style: vibrant colorful children's book cartoon, consistent character design, " +
                $"no text, no words, no letters, no captions, no watermarks."
            )
        ).ToList();

        var imageUrls = await Task.WhenAll(imageTasks);

        for (int i = 0; i < story.Pages.Count; i++)
            story.Pages[i].ImageUrl = imageUrls[i];

        return story;
    }
}
