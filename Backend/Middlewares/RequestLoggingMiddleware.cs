using System.Diagnostics;

namespace Backend.Middlewares;

/// <summary>
/// Logs HTTP request and response details.
/// Automatically detects slow requests and server errors.
/// </summary>
public class RequestLoggingMiddleware(ILogger<RequestLoggingMiddleware> logger) : IMiddleware
{
    /// <summary>Paths excluded from logging.</summary>
    private readonly string[] ExcludedPaths = ["/health"];
    
    /// <summary>Threshold in milliseconds to classify a request as slow.</summary>
    private const int SlowRequestThresholdMs = 2000;

    /// <summary>
    /// Processes the request by measuring its duration and logging details.
    /// </summary>
    /// <param name="context">Current HTTP context</param>
    /// <param name="next">Next middleware in the pipeline</param>
    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        var request = context.Request;
        var path = request.Path.Value?.ToLowerInvariant();

        if (path is not null && ExcludedPaths.Contains(path))
        {
            await next(context);
            return;
        }

        var stopwatch = Stopwatch.StartNew();
        var correlationId = Activity.Current?.Id ?? context.TraceIdentifier;

        logger.LogInformation("Logger - CorrelationId: {CorrelationId} - Incoming Request: {Method} {Path}", correlationId, request.Method, request.Path);

        await next(context);

        stopwatch.Stop();

        var statusCode = context.Response.StatusCode;
        var elapsedMs = stopwatch.ElapsedMilliseconds;

        //log response details
        logger.LogInformation("Logger - CorrelationId: {CorrelationId} - Outgoing Response: {StatusCode} {ElapsedMs}ms - {Method} {Path}",
        correlationId, statusCode, elapsedMs, request.Method, request.Path);

        if (statusCode >= 500)
        {
            logger.LogError("Logger - CorrelationId: {CorrelationId} - Server Error: {StatusCode} - Duration: {ElapsedMilliseconds}ms - Path: {Method} {Path}",
            correlationId, statusCode, elapsedMs, request.Method, request.Path);
        }
        if (statusCode >= 400 && statusCode < 500)
        {
            logger.LogWarning("Logger - CorrelationId: {CorrelationId} - Client Error Detected: {StatusCode} - Duration: {ElapsedMilliseconds}ms", 
            correlationId, statusCode, elapsedMs);
        }
        if (elapsedMs > SlowRequestThresholdMs)
        {
            logger.LogWarning("Logger - CorrelationId: {CorrelationId} - Slow Request Detected: {StatusCode} - Duration: {ElapsedMilliseconds}ms (> {Threshold}ms)",
            correlationId, statusCode, elapsedMs, SlowRequestThresholdMs);
        }
    }
}