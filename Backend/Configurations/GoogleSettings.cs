namespace Backend.Configurations;

/// <summary>
/// Represents Google OAuth 2.0 authentication settings.
/// </summary>
public class GoogleSettings
{
    /// <summary>
    /// Initializes a new instance of the <see cref="GoogleSettings"/> class
    /// with values from environment variables.
    /// </summary>
    public GoogleSettings()
    {
        ClientId = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")!;
        ClientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")!;
    }

    /// <summary>
    /// Gets or sets the Google OAuth 2.0 client ID.
    /// </summary>
    public string ClientId { get; set; } = string.Empty;

    /// <summary>
    /// Gets or sets the Google OAuth 2.0 client secret.
    /// </summary>
    public string ClientSecret { get; set; } = string.Empty;
}