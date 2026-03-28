namespace DreamTaleAI.Core.DTOs;

public class DrawingResponse
{
    public bool Success { get; set; }
    public string DetectedValue { get; set; } = string.Empty;
    public double Confidence { get; set; }
    public bool? Inappropriate { get; set; }
    public string? ModerationMessage { get; set; }
}
