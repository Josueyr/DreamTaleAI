namespace DreamTaleAI.Core.Models;

public class Story
{
    public string Title { get; set; } = string.Empty;
    public List<StoryPage> Pages { get; set; } = new();
}

public class StoryPage
{
    public int PageNumber { get; set; }
    public string Text { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public string AudioUrl { get; set; } = string.Empty;
}
