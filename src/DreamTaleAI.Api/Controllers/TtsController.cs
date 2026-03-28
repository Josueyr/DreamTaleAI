using Microsoft.AspNetCore.Mvc;

namespace DreamTaleAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TtsController : ControllerBase
{
    [HttpGet("synthesize")]
    public IActionResult Synthesize([FromQuery] string text = "", [FromQuery] string lang = "es-ES")
    {
        // El frontend usa Web Speech API del navegador directamente.
        // Este endpoint retorna la info necesaria para que el cliente haga la síntesis.
        return Ok(new { text, lang, useWebSpeechApi = true });
    }
}
