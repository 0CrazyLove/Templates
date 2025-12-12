using Backend.Models;

namespace Backend.Repository.Interfaces;

/// <summary>
/// Repository interface for managing Google refresh tokens.
/// </summary>
public interface IRefreshTokenRepository : IRepository<UserGoogleToken>
{
    /// <summary>
    /// Retrieves a user's Google refresh token by their user ID.
    /// </summary>
    /// <param name="userId">The unique identifier of the user.</param>
    /// <param name="cancellationToken">Cancellation token to cancel the operation.</param>
    /// <returns>The user's Google token if found; otherwise, null.</returns>
    Task<UserGoogleToken?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default);
}
