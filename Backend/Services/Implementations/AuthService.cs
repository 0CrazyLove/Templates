using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementations;

public class AuthService(
    UserManager<IdentityUser> userManager,
    SignInManager<IdentityUser> signInManager,
    IHttpClientFactory httpClientFactory,
    AppDbContext context) : IAuthService
{
    public async Task<(AuthResponseDto? response, bool succeeded)> RegisterUserAsync(RegisterDto model)
    {
        var user = new IdentityUser
        {
            UserName = model.UserName,
            Email = model.Email
        };
        var result = await userManager.CreateAsync(user, model.Password!);
        if (!result.Succeeded) return (null, false);
        await userManager.AddToRoleAsync(user, "Customer");
        var roles = await userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);
        var response = new AuthResponseDto
        {
            Token = token,
            Username = user.UserName!,
            Email = user.Email!,
            Roles = roles
        };
        return (response, true);
    }

    public async Task<(AuthResponseDto? response, bool succeeded)> LoginUserAsync(LoginDto model)
    {
        if (string.IsNullOrWhiteSpace(model.Email) || string.IsNullOrWhiteSpace(model.Password))
        {
            await Task.Delay(Random.Shared.Next(100, 300));
            return (null, false);
        }
        var user = await userManager.FindByEmailAsync(model.Email);
        if (user is null)
        {
            await Task.Delay(Random.Shared.Next(100, 300));
            return (null, false);
        }
        var result = await signInManager.CheckPasswordSignInAsync(user, model.Password, lockoutOnFailure: true);
        if (!result.Succeeded)
        {
            await Task.Delay(Random.Shared.Next(100, 300));
            return (null, false);
        }
        var roles = await userManager.GetRolesAsync(user);
        var token = GenerateJwtToken(user, roles);
        var response = new AuthResponseDto
        {
            Token = token,
            Username = user.UserName!,
            Email = user.Email!,
            Roles = roles
        };
        return (response, true);
    }

    // MÉTODO ACTUALIZADO: Ahora recibe el código de autorización
    public async Task<(AuthResponseDto? response, bool succeeded)> GoogleCallbackAsync(string authorizationCode)
    {
        try
        {
            // 1. Intercambiar el código de autorización por tokens
            var tokenResponse = await ExchangeCodeForTokensAsync(authorizationCode);
            
            // 2. Obtener información del usuario con el access token
            var userInfo = await GetGoogleUserInfoAsync(tokenResponse.AccessToken);
            
            // 3. Buscar o crear usuario
            var user = await userManager.FindByEmailAsync(userInfo.Email);
            if (user == null)
            {
                user = new IdentityUser
                {
                    UserName = userInfo.Email,
                    Email = userInfo.Email,
                    EmailConfirmed = true
                };
                var createResult = await userManager.CreateAsync(user);
                if (!createResult.Succeeded)
                {
                    return (null, false);
                }
                await userManager.AddToRoleAsync(user, "Customer");
            }

            // 4. Guardar refresh token si existe
            if (!string.IsNullOrEmpty(tokenResponse.RefreshToken))
            {
                await SaveRefreshTokenAsync(user.Id, tokenResponse.RefreshToken, tokenResponse.ExpiresIn);
                Console.WriteLine($"✅ Refresh token guardado para usuario {user.Email}");
            }
            else
            {
                Console.WriteLine($"⚠️ No se recibió refresh token para usuario {user.Email}");
            }

            // 5. Actualizar claims
            var existingClaims = await userManager.GetClaimsAsync(user);
            var googleClaims = existingClaims.Where(c =>
                c.Type == "google_id" ||
                c.Type == "google_picture" ||
                c.Type == "google_name").ToList();
            
            if (googleClaims.Any())
            {
                await userManager.RemoveClaimsAsync(user, googleClaims);
            }

            var claims = new List<Claim>
            {
                new("google_id", userInfo.Sub),
                new("google_picture", userInfo.Picture ?? ""),
                new("google_name", userInfo.Name ?? "")
            };
            await userManager.AddClaimsAsync(user, claims);

            // 6. Generar JWT y responder
            var roles = await userManager.GetRolesAsync(user);
            var token = GenerateJwtToken(user, roles, userInfo.Name, userInfo.Picture);

            var response = new AuthResponseDto
            {
                Token = token,
                Username = user.UserName!,
                Email = user.Email!,
                Roles = roles
            };

            return (response, true);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"❌ Error en GoogleCallbackAsync: {ex.Message}");
            Console.WriteLine($"Stack trace: {ex.StackTrace}");
            return (null, false);
        }
    }

    private async Task<GoogleTokenResponse> ExchangeCodeForTokensAsync(string code)
    {
        var client = httpClientFactory.CreateClient();

        var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")! },
            { "client_secret", Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")! },
            { "redirect_uri", "postmessage" },
            { "grant_type", "authorization_code" }
        });

        var response = await client.PostAsync("https://oauth2.googleapis.com/token", content);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync();
            throw new Exception($"Error al intercambiar código: {errorContent}");
        }

        var tokenResponse = await response.Content.ReadFromJsonAsync<GoogleTokenResponse>();

        if (tokenResponse == null)
        {
            throw new Exception("No se pudo obtener los tokens de Google");
        }

        return tokenResponse;
    }

    private async Task<GoogleJwtPayload> GetGoogleUserInfoAsync(string accessToken)
    {
        var client = httpClientFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

        var response = await client.GetAsync("https://www.googleapis.com/oauth2/v2/userinfo");

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception("No se pudo obtener información del usuario de Google");
        }

        var userInfo = await response.Content.ReadFromJsonAsync<GoogleJwtPayload>();

        if (userInfo == null)
        {
            throw new Exception("Información de usuario inválida");
        }

        return userInfo;
    }

    public async Task SaveRefreshTokenAsync(string userId, string refreshToken, int expiresIn)
    {
        var existingToken = await context.UserGoogleTokens.FirstOrDefaultAsync(t => t.UserId == userId);
        if (existingToken != null)
        {
            existingToken.RefreshToken = refreshToken;
            existingToken.ExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn);
        }
        else
        {
            var newToken = new UserGoogleToken
            {
                UserId = userId,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddSeconds(expiresIn),
                CreatedAt = DateTime.UtcNow
            };
            context.UserGoogleTokens.Add(newToken);
        }
        await context.SaveChangesAsync();
    }

    private static string GenerateJwtToken(IdentityUser user, IList<string> roles, string? displayName = null, string? picture = null)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Environment.GetEnvironmentVariable("JWT_SECRET_KEY")!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var claims = new List<Claim>
        {
            new(JwtRegisteredClaimNames.Sub, user.Id),
            new(JwtRegisteredClaimNames.Email, user.Email!),
            new(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new(ClaimTypes.Name, user.UserName!)
        };

        if (!string.IsNullOrEmpty(displayName))
        {
            claims.Add(new Claim("display_name", displayName));
        }
        if (!string.IsNullOrEmpty(picture))
        {
            claims.Add(new Claim("picture", picture));
        }

        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var token = new JwtSecurityToken(
            issuer: Environment.GetEnvironmentVariable("JWT_ISSUER"),
            audience: Environment.GetEnvironmentVariable("JWT_AUDIENCE"),
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(Environment.GetEnvironmentVariable("JWT_EXPIRATION_MINUTES")!)),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

public class GoogleJwtPayload
{
    [System.Text.Json.Serialization.JsonPropertyName("sub")]
    public string Sub { get; set; } = string.Empty;
    
    [System.Text.Json.Serialization.JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;
    
    [System.Text.Json.Serialization.JsonPropertyName("email_verified")]
    public bool EmailVerified { get; set; }
    
    [System.Text.Json.Serialization.JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [System.Text.Json.Serialization.JsonPropertyName("picture")]
    public string? Picture { get; set; }
}

public class GoogleTokenResponse
{
    [System.Text.Json.Serialization.JsonPropertyName("access_token")]
    public string AccessToken { get; set; } = string.Empty;
    
    [System.Text.Json.Serialization.JsonPropertyName("refresh_token")]
    public string? RefreshToken { get; set; }
    
    [System.Text.Json.Serialization.JsonPropertyName("expires_in")]
    public int ExpiresIn { get; set; }
    
    [System.Text.Json.Serialization.JsonPropertyName("token_type")]
    public string TokenType { get; set; } = string.Empty;
}