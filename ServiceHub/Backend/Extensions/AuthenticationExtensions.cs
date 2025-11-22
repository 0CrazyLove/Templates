/// <summary>
/// Authentication and authorization configuration extensions.
/// Configures JWT Bearer authentication, authorization policies, and Google OAuth.
/// </summary>

using Backend.Configurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Protocols.OpenIdConnect;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Backend.Extensions;

public static class AuthenticationExtensions
{
    /// <summary>
    /// Configures JWT Bearer authentication with token validation.
    /// </summary>
    public static IServiceCollection AddJwtAuthentication(this IServiceCollection services, JwtSettings jwtSettings )
    {
        var jwtSecretKey = jwtSettings.SecretKey;
        var jwtIssuer = jwtSettings.Issuer;
        var jwtAudience = jwtSettings.Audience;

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
        .AddJwtBearer(options =>
        {
            options.RequireHttpsMetadata = false;
            options.SaveToken = true;
            options.TokenValidationParameters = new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecretKey))
            };
        });

        return services;
    }

    /// <summary>
    /// Configures authorization policies for Admin and Customer roles.
    /// </summary>
    public static IServiceCollection AddAuthorizationPolicies(this IServiceCollection services)
    {
        services.AddAuthorizationBuilder().AddPolicy("AdminPolicy", policy => policy.RequireRole("Admin"))
    .AddPolicy("CustomerPolicy", policy => policy.RequireRole("Customer"));

        return services;
    }

    /// <summary>
    /// Configures Google OAuth services and HTTP clients.
    /// </summary>
    public static IServiceCollection AddGoogleOAuth(this IServiceCollection services)
    {
        // Configure OpenID Connect configuration manager for Google
        services.AddSingleton<IConfigurationManager<OpenIdConnectConfiguration>>(sp =>
            new ConfigurationManager<OpenIdConnectConfiguration>(
                "https://accounts.google.com/.well-known/openid-configuration",
                new OpenIdConnectConfigurationRetriever(),
                new HttpDocumentRetriever() { RequireHttps = true })
            {
                AutomaticRefreshInterval = TimeSpan.FromHours(12),
                RefreshInterval = TimeSpan.FromMinutes(30)
            }
        );

        // Configure HTTP clients for Google API calls
        services.AddHttpClient("GoogleApi", client =>
        {
            client.BaseAddress = new Uri("https://www.googleapis.com/oauth2/v2/");
        });

        services.AddHttpClient("GoogleToken", client =>
        {
            client.BaseAddress = new Uri("https://oauth2.googleapis.com/");
        });

        return services;
    }
}