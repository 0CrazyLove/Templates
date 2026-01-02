using System.Diagnostics;
using System.Net;
using System.Text.Json;

namespace Backend.Middlewares;

/// <summary>
/// Handles uncaught exceptions globally in the application.
/// Returns standardized error responses with correlationId for traceability.
/// </summary>
public class GlobalExceptionMiddleware(ILogger<GlobalExceptionMiddleware> logger, IHostEnvironment env) : IMiddleware
{
    /// <summary>
    /// Intercepts the request, captures exceptions, and executes the next middleware.
    /// </summary>
    /// <param name="context">Current HTTP context</param>
    /// <param name="next">Next middleware in the pipeline</param>
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    /// <summary>
    /// Builds the error response with correlation context.
    /// </summary>
    /// <param name="context">HTTP context to update the response</param>
    /// <param name="ex">Caught exception</param>
    /// <returns>Completed task after writing the response</returns>
    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        var correlationId = Activity.Current?.Id ?? context.TraceIdentifier;

        logger.LogError(ex, "Logger - CorrelationId: {CorrelationId} - An unhandled exception occurred: {Message}", correlationId, ex.Message);

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

        var response = new
        {
            context.Response.StatusCode,
            Message = env.IsDevelopment() ? ex.Message : "An internal server error occurred. Please try again later.",
            CorrelationId = correlationId
        };

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }
}
