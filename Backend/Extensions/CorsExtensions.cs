/// <summary>
/// CORS configuration extensions for cross-origin requests.
/// </summary>

namespace Backend.Extensions;

public static class CorsExtensions
{
    /// <summary>
    /// Configures CORS policy to allow requests from the frontend application.
    /// </summary>
    /// <param name="services">The service collection to add CORS to.</param>
    /// <returns>The service collection for chaining.</returns>
    public static void AddCorsConfiguration(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddPolicy("AllowFrontend", policy =>
            {
                policy.WithOrigins("http://localhost:4321", "https://localhost:4321").AllowAnyMethod().AllowAnyHeader().AllowCredentials();
            });
        });

    }
}