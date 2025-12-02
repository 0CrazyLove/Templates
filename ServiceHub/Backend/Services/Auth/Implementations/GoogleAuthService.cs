using Backend.Configurations;
using Backend.DTOs.Auth.GoogleAuth;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Backend.Services.Auth.Interfaces;
using Microsoft.AspNetCore.Identity;


namespace Backend.Services.Auth.Implementations;

/// <summary>
/// Service responsible for Google OAuth authentication operations.
/// </summary>
public class GoogleAuthService(IHttpClientFactory httpClientFactory, GoogleSettings googleSettings,
IConfigurationManager<OpenIdConnectConfiguration> configurationManager,
ILogger<GoogleAuthService> logger, UserManager<IdentityUser> userManager) : IGoogleAuthService
{
    /// <summary>
    /// Exchange Google authorization code for access and refresh tokens.
    /// </summary>
    public async Task<GoogleTokenDto> ExchangeCodeForTokensAsync(string code, CancellationToken cancellationToken)
    {
        var client = httpClientFactory.CreateClient("GoogleToken");

        using var content = new FormUrlEncodedContent(new Dictionary<string, string>
        {
            { "code", code },
            { "client_id", googleSettings.ClientId },
            { "client_secret", googleSettings.ClientSecret },
            { "redirect_uri", "postmessage" },
            { "grant_type", "authorization_code" }
        });

        var response = await client.PostAsync("token", content, cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            var errorContent = await response.Content.ReadAsStringAsync(cancellationToken);
            logger.LogError("Failed to exchange authorization code: {Error}", errorContent);
            throw new Exception($"Failed to exchange authorization code: {errorContent}");
        }

        var tokenResponse = await response.Content.ReadFromJsonAsync<GoogleTokenDto>(cancellationToken);

        return tokenResponse ?? throw new Exception("Failed to deserialize token response from Google");
    }

    /// <summary>
    /// Decode and validate Google ID token using Google's public keys.
    /// </summary>
    public async Task<GoogleJwtPayloadDto> DecodeAndValidateIdTokenAsync(string idToken, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(idToken))
        {
            throw new ArgumentException("Token cannot be empty", nameof(idToken));
        }

        var handler = new JwtSecurityTokenHandler();

        var discoveryDocument = await configurationManager.GetConfigurationAsync(cancellationToken);

        var validationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuers = ["https://accounts.google.com", "accounts.google.com"],
            ValidateAudience = true,
            ValidAudience = googleSettings.ClientId,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(5),
            ValidateIssuerSigningKey = true,
            IssuerSigningKeys = discoveryDocument.SigningKeys,
            RequireExpirationTime = true,
            RequireSignedTokens = true
        };

        var result = await handler.ValidateTokenAsync(idToken, validationParameters);

        if (!result.IsValid) throw new SecurityTokenException("Invalid token", result.Exception);

        if (result.SecurityToken is not JwtSecurityToken jwt || jwt.Header.Alg is not SecurityAlgorithms.RsaSha256)
        {
            throw new SecurityTokenException("Invalid token: unsupported algorithm");
        }

        string GetRequiredClaim(string type) => jwt.Claims.FirstOrDefault(c => c.Type == type)?.Value ?? throw new SecurityTokenException($"Claim '{type}' is required");

        string? GetOptionalClaim(string type) => jwt.Claims.FirstOrDefault(c => c.Type == type)?.Value;

        var sub = GetRequiredClaim("sub");
        var email = GetRequiredClaim("email");
        var name = GetRequiredClaim("name");
        var picture = GetOptionalClaim("picture");
        var emailVerifiedStr = GetOptionalClaim("email_verified");

        //Validate both boolean expressions
        var emailVerified = bool.TryParse(emailVerifiedStr, out var isVerified) && isVerified;

        return new GoogleJwtPayloadDto
        {
            Sub = sub,
            Email = email,
            EmailVerified = emailVerified,
            Name = name,
            Picture = picture
        };
    }

    public async Task<IdentityUser?> FindOrCreateGoogleUserAsync(GoogleJwtPayloadDto userInfo)
    {
        if (userInfo.Email is null)
        {
            logger.LogError("Google user info missing email");
            return null;
        }

        var user = await userManager.FindByEmailAsync(userInfo.Email);

        if (user != null)
        {
            return user;
        }

        // Create new user
        user = new IdentityUser
        {
            UserName = userInfo.Email,
            Email = userInfo.Email,
            EmailConfirmed = true
        };

        var createResult = await userManager.CreateAsync(user);

        if (!createResult.Succeeded)
        {
            var errorCodes = string.Join(", ", createResult.Errors.Select(e => e.Code));
            logger.LogError("Failed to create user for email {Email}. Errors: {Errors}", userInfo.Email, errorCodes);
            return null;
        }

        var roleResult = await userManager.AddToRoleAsync(user, "Customer");
        if (!roleResult.Succeeded)
        {
            var errors = string.Join(", ", roleResult.Errors.Select(e => $"{e.Code}: {e.Description}"));

            await userManager.DeleteAsync(user);

            logger.LogWarning("Failed to add Customer role to user {UserId}. Errors: {Errors}", user.Id, errors);

            return null;
        }
        logger.LogInformation("Created new Google user: {UserId}, Email: {Email}", user.Id, user.Email);

        return user;
    }

    /// <summary>
    /// Update user's Google-related claims (google_id, google_picture, google_name).
    /// </summary>
    public async Task UpdateGoogleClaimsAsync(IdentityUser user, GoogleJwtPayloadDto userInfo)
    {
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
            new("google_id", userInfo.Sub ?? ""),
            new("google_picture", userInfo.Picture ?? ""),
            new("google_name", userInfo.Name ?? "")
        };

        await userManager.AddClaimsAsync(user, claims);
        logger.LogDebug("Updated Google claims for user: {UserId}", user.Id);
    }
}