using Backend.Data;
using Backend.Models;
using Backend.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;
using Backend.DTOs.Orders;
using AutoMapper;

namespace Backend.Repository.Implementations;

/// <summary>
/// Implementation of the order repository using Entity Framework Core.
/// </summary>
public class OrderRepository(AppDbContext context, IMapper mapper) : Repository<Order>(context), IOrderRepository
{
    /// <inheritdoc />
    public async Task<IList<OrderResponseDto>> GetOrdersAsync(CancellationToken cancellationToken = default)
    {
        var orders = await _dbSet.AsNoTracking().Include(o => o.OrderItems).ThenInclude(oi => oi.Service).ToListAsync(cancellationToken);

        return mapper.Map<IList<OrderResponseDto>>(orders);
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
