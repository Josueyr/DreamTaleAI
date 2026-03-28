using Microsoft.AspNetCore.Mvc;

namespace DreamTaleAI.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ImagesController : ControllerBase
{
    [HttpGet("placeholder")]
    public IActionResult Placeholder([FromQuery] int page = 1, [FromQuery] string? prompt = null)
    {
        var colors = new[] { "#FFB347", "#87CEEB", "#98FB98", "#DDA0DD", "#F08080", "#87CEFA" };
        var color = colors[(page - 1) % colors.Length];

        var label = prompt ?? $"Página {page}";
        var svg = $@"<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300'>
  <rect width='400' height='300' fill='{color}'/>
  <text x='200' y='140' font-family='Arial' font-size='20' fill='white' text-anchor='middle' font-weight='bold'>✨ DreamTaleAI ✨</text>
  <text x='200' y='175' font-family='Arial' font-size='14' fill='white' text-anchor='middle'>{System.Web.HttpUtility.HtmlEncode(label)}</text>
</svg>";

        return Content(svg, "image/svg+xml");
    }
}
