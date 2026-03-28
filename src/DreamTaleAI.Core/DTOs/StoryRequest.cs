namespace DreamTaleAI.Core.DTOs;

public class StoryRequest
{
    public int Age { get; set; }
    public string Character { get; set; } = string.Empty;
    public string Emotion { get; set; } = string.Empty;
}
