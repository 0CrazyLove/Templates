using Backend.Data;
using Backend.Models;
using Backend.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Repository.Implementations;

/// <summary>
/// Implementation of the order repository using Entity Framework Core.
/// </summary>
public class OrderRepository(AppDbContext context) : Repository<Order>(context), IOrderRepository
{
    /// <inheritdoc />
    public async Task<IEnumerable<Order>> GetOrdersWithItemsAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Service).ToListAsync(cancellationToken);
    }

    /// <inheritdoc />
    public async Task<Order?> GetOrderByIdWithItemsAsync(int id, CancellationToken cancellationToken = default)
    {
        return await _dbSet.Include(o => o.OrderItems).ThenInclude(oi => oi.Service).FirstOrDefaultAsync(o => o.Id == id, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<decimal> GetTotalSalesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.SumAsync(o => o.TotalAmount, cancellationToken);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet.CountAsync(cancellationToken);
    }
}
