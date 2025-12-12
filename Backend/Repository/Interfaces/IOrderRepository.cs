using Backend.Models;

namespace Backend.Repository.Interfaces;

/// <summary>
/// Repository interface for managing customer orders.
/// </summary>
public interface IOrderRepository : IRepository<Order>
{
    /// <summary>
    /// Retrieves all orders including their associated items and services.
    /// </summary>
    /// <returns>A collection of orders with full details.</returns>
    Task<IEnumerable<Order>> GetOrdersWithItemsAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Retrieves a specific order by its ID, including items and services.
    /// </summary>
    /// <param name="id">The unique identifier of the order.</param>
    /// <returns>The order with details if found; otherwise, null.</returns>
    Task<Order?> GetOrderByIdWithItemsAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// Calculates the total sales amount from all orders.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token to cancel the operation.</param>
    /// <returns>The total sales amount.</returns>
    Task<decimal> GetTotalSalesAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// Gets the total count of orders in the repository.
    /// </summary>
    /// <param name="cancellationToken">Cancellation token to cancel the operation.</param>
    /// <returns>The total number of orders.</returns>
    Task<int> GetCountAsync(CancellationToken cancellationToken = default);
}
