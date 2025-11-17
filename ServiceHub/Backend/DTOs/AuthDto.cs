using System.ComponentModel.DataAnnotations;
namespace Backend.DTOs;

public class LoginDto
{
    /// <summary>
    /// Gets or sets the user's email address for authentication.
    /// </summary>
    [Required]
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the user's password for authentication.
    /// Must meet the configured password policy requirements.
    /// </summary>
    [Required]
    public string? Password { get; set; }
}

public class RegisterDto
{
    /// <summary>
    /// Gets or sets the username for the new account.
    /// Must be unique and required.
    /// </summary>
    [Required]
    public string? UserName { get; set; }

    /// <summary>
    /// Gets or sets the email address for the new account.
    /// Must be unique and required.
    /// </summary>
    [Required]
    public string? Email { get; set; }

    /// <summary>
    /// Gets or sets the password for the new account.
    /// Must meet the configured password policy:
    /// - At least 6 characters
    /// - Contains at least one uppercase letter
    /// - Contains at least one lowercase letter
    /// - Contains at least one digit
    /// </summary>
    [Required]
    public string? Password { get; set; }
}