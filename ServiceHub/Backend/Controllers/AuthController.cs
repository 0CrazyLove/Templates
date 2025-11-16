using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    // POST: api/auth/register
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto model)
    {
        var (response, succeeded) = await authService.RegisterUserAsync(model);

        if (!succeeded) return BadRequest();

        return Ok(response);
    }

    // POST: api/auth/login
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var (response, succeeded) = await authService.LoginUserAsync(model);

        if (!succeeded) return Unauthorized();

        return Ok(response);
    }

    // POST: api/auth/google/callback
    [HttpPost("google/callback")]
    public async Task<IActionResult> GoogleCallback([FromBody] GoogleAuthCodeDto model)
    {
        if (string.IsNullOrEmpty(model.Code))
        {
            return BadRequest(new { message = "El código de autorización es requerido" });
        }

        var (response, succeeded) = await authService.GoogleCallbackAsync(model.Code);

        if (!succeeded || response == null)
        {
            return Unauthorized(new { message = "Error en la autenticación con Google" });
        }

        return Ok(response);
    }
}
