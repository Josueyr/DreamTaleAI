using DreamTaleAI.Core.DTOs;
using DreamTaleAI.Core.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace DreamTaleAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DrawingController : ControllerBase
{
    private readonly IVisionService _visionService;
    private readonly ILogger<DrawingController> _logger;

    public DrawingController(IVisionService visionService, ILogger<DrawingController> logger)
    {
        _visionService = visionService;
        _logger = logger;
    }

    [HttpPost("recognize-age")]
    public async Task<ActionResult<DrawingResponse>> RecognizeAge([FromBody] DrawingRequest request)
    {
        try
        {
            var result = await _visionService.RecognizeAgeAsync(request.ImageBase64);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recognizing age");
            return Ok(new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 });
        }
    }

    [HttpPost("recognize-character")]
    public async Task<ActionResult<DrawingResponse>> RecognizeCharacter([FromBody] DrawingRequest request)
    {
        try
        {
            var result = await _visionService.RecognizeCharacterAsync(request.ImageBase64);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error recognizing character");
            return Ok(new DrawingResponse { Success = false, DetectedValue = "", Confidence = 0 });
        }
    }
}
