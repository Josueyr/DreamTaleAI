namespace DreamTaleAI.Core.Models;

public class StorySession
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public int Age { get; set; }
    public string Character { get; set; } = string.Empty;
    public string Emotion { get; set; } = string.Empty;
    public Story? Story { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
