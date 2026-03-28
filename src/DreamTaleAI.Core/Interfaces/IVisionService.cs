using DreamTaleAI.Core.DTOs;

namespace DreamTaleAI.Core.Interfaces;

public interface IVisionService
{
    Task<DrawingResponse> RecognizeAgeAsync(string imageBase64);
    Task<DrawingResponse> RecognizeCharacterAsync(string imageBase64);
}
