using System.Diagnostics;
using Backend.Services.Database.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Extensions;

/// <summary>
/// Provides extension methods for <see cref="WebApplication"/> to handle application startup tasks.
/// </summary>
/// <remarks>
/// These methods are intended to be invoked during the application startup pipeline, 
/// specifically for operations requiring a scoped service provider, such as database migrations and data seeding.
/// </remarks>
public static class WebApplicationExtensions
{
    /// <summary>
    /// Applies pending database migrations for the specified <see cref="DbContext"/> context.
    /// </summary>
    /// <typeparam name="TContext">The type of the <see cref="DbContext"/> to migrate.</typeparam>
    /// <param name="app">The <see cref="WebApplication"/> instance providing access to the service provider.</param>
    /// <returns>A task that represents the asynchronous migration operation.</returns>
    /// <remarks>
    /// This method creates a temporary service scope to resolve the <typeparamref name="TContext"/>.
    /// It ensures that the database schema is up-to-date before the application starts accepting requests.
    /// </remarks>
    public static async Task ApplyMigrations<TContext>(this WebApplication app) where TContext : DbContext
    {
        using var scope = app.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        var correlationId = Activity.Current?.Id ?? Guid.NewGuid().ToString();

        try
        {
            logger.LogDebug("Logger - CorrelationId: {CorrelationId} - Starting database migration for context {ContextName}.", correlationId, typeof(TContext).Name);

            var context = scope.ServiceProvider.GetRequiredService<TContext>();
            await context.Database.MigrateAsync();

            logger.LogInformation("Logger - CorrelationId: {CorrelationId} - Database migration for context {ContextName} completed successfully.", correlationId, typeof(TContext).Name);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Logger - CorrelationId: {CorrelationId} - An error occurred while applying migrations for context {ContextName}.", correlationId, typeof(TContext).Name);
            throw;
        }
    }

    /// <summary>
    /// Executes the registered <see cref="IDatabaseSeeder"/> to populate the database with initial data.
    /// </summary>
    /// <param name="app">The <see cref="WebApplication"/> instance providing access to the service provider.</param>
    /// <returns>A task that represents the asynchronous seeding operation.</returns>
    /// <remarks>
    /// This method creates a temporary service scope to resolve the <see cref="IDatabaseSeeder"/>.
    /// It should be called after migrations are applied to ensure the database structure exists.
    /// </remarks>
    public static async Task SeedDatabaseAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
        var correlationId = Activity.Current?.Id ?? Guid.NewGuid().ToString();

        try
        {
            logger.LogDebug("Logger - CorrelationId: {CorrelationId} - Starting database seeding.", correlationId);

            var seeder = scope.ServiceProvider.GetRequiredService<IDatabaseSeeder>();
            await seeder.SeedAsync();

            logger.LogInformation("Logger - CorrelationId: {CorrelationId} - Database seeding completed successfully.", correlationId);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Logger - CorrelationId: {CorrelationId} - An error occurred during database seeding.", correlationId);
            throw;
        }
    }
}