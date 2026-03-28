using DreamTaleAI.Core.Interfaces;
using DreamTaleAI.Core.Models;

namespace DreamTaleAI.Infrastructure.AI.Mock;

public class MockStoryGeneratorService : IStoryGeneratorService
{
    public Task<Story> GenerateStoryAsync(int age, string character, string emotion)
    {
        var story = new Story
        {
            Title = $"La gran aventura de {character}",
            Pages = new List<StoryPage>
            {
                new StoryPage
                {
                    PageNumber = 1,
                    Text = $"Había una vez un {character} de {age} años que se sentía muy {emotion}. Vivía en un bosque mágico lleno de colores y sonrisas.",
                    ImageUrl = "/api/images/placeholder?page=1"
                },
                new StoryPage
                {
                    PageNumber = 2,
                    Text = $"Un día, el {character} decidió emprender una aventura increíble. Empacó sus cosas favoritas y comenzó a caminar por el sendero dorado.",
                    ImageUrl = "/api/images/placeholder?page=2"
                },
                new StoryPage
                {
                    PageNumber = 3,
                    Text = $"En el camino encontró amigos maravillosos que también se sentían {emotion}. Juntos descubrieron que la amistad hace todo más divertido.",
                    ImageUrl = "/api/images/placeholder?page=3"
                },
                new StoryPage
                {
                    PageNumber = 4,
                    Text = $"Al final del día, el {character} regresó a casa con el corazón lleno de alegría. ¡Había vivido la aventura más emocionante de su vida! Fin.",
                    ImageUrl = "/api/images/placeholder?page=4"
                }
            }
        };

        return Task.FromResult(story);
    }

    public Task<string> GenerateVisualStyleAsync(string character, string emotion, string storyTitle)
    {
        return Task.FromResult($"A cute friendly {character}, cartoon style, vibrant colors");
    }
}
