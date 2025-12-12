using Backend.Models;

namespace Backend.Repository.Interfaces;

/// <summary>
/// Repository interface for managing services in the catalog.
/// </summary>
public interface IServiceRepository : IRepository<Service>
{
    /// <summary>
    /// Retrieves a paginated list of services with optional filtering.
    /// </summary>
    /// <param name="category">The category to filter by (optional).</param>
    /// <param name="page">The page number to retrieve (1-based).</param>
    /// <param name="pageSize">The number of items per page.</param>
    /// <param name="minPrice">The minimum price filter (optional).</param>
    /// <param name="maxPrice">The maximum price filter (optional).</param>
    /// <returns>A tuple containing the list of services and the total count of matching services.</returns>
    Task<(IEnumerable<Service> Items, int TotalCount)> GetServicesAsync(string? category, int page, int pageSize, decimal? minPrice, decimal? maxPrice, 
    CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves all unique service categories.
    /// </summary>
    /// <returns>A collection of unique category names.</returns>
    Task<IEnumerable<string>> GetCategoriesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the total count of services in the repository.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token to cancel the operation.</param>
    /// <returns>The total number of services.</returns>
    Task<int> GetCountAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a list of services by their unique identifiers.
    /// </summary>
    /// <param name="ids">The collection of service IDs to retrieve.</param>
    /// <returns>A collection of services matching the provided IDs.</returns>
    Task<IEnumerable<Service>> GetByIdsAsync(IEnumerable<int> ids, CancellationToken cancellationToken = default);
}
