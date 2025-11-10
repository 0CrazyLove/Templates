using Backend.DTOs;
using backend.DTOs;
namespace Backend.Services.Interfaces;

public interface IAuthService
{
    Task<(AuthResponseDto? response, bool succeeded)> RegisterUserAsync(RegisterDto model);
    Task<(AuthResponseDto? response, bool succeeded)> LoginUserAsync(LoginDto model);

}