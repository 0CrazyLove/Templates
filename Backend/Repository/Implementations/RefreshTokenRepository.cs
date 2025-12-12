using Backend.Data;
using Backend.Models;
using Backend.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository.Implementations;

/// <summary>
/// Implementation of the refresh token repository using Entity Framework Core.
/// </summary>
public class RefreshTokenRepository(AppDbContext context) : Repository<UserGoogleToken>(context), IRefreshTokenRepository
{
    /// <inheritdoc />
    public async Task<UserGoogleToken?> GetByUserIdAsync(string userId, CancellationToken cancellationToken = default)
    {
        return await _dbSet.FirstOrDefaultAsync(t => t.UserId == userId, cancellationToken);
    }
}
