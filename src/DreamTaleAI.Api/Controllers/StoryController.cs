using DreamTaleAI.Core.DTOs;
using DreamTaleAI.Infrastructure.AI.Services;
using Microsoft.AspNetCore.Mvc;

namespace DreamTaleAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StoryController : ControllerBase
{
    private readonly StoryOrchestrator _orchestrator;

    public StoryController(StoryOrchestrator orchestrator)
    {
        _orchestrator = orchestrator;
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate([FromBody] StoryRequest request)
    {
        if (request.Age < 0 || request.Age > 12)
            return BadRequest(new { error = "La edad debe estar entre 0 y 12 años." });

        var story = await _orchestrator.CreateStoryAsync(request.Age, request.Character, request.Emotion);
        return Ok(story);
    }
}
