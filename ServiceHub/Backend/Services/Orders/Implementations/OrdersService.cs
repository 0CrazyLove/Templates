using Backend.Data;
using Backend.DTOs.Orders;
using Backend.Models;
using Backend.Services.Orders.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Orders.Implementations;

/// <summary>
/// Implementation of order service for managing customer orders.
/// 
/// Handles order creation, retrieval, and transformation to DTOs.
/// Ensures service availability validation and accurate pricing calculation.
/// </summary>
public class OrdersService(AppDbContext context) : IOrdersService
{
    /// <summary>
    /// Retrieves all orders with their associated items and services.
    /// </summary>
    /// <returns>A collection of order DTOs containing order details.</returns>
    public async Task<IEnumerable<OrderResponseDto>> GetOrdersAsync()
    {
        var orders = await context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Service)
            .ToListAsync();
            
        return orders.Select(o => new OrderResponseDto
        {
            Id = o.Id,
            OrderDate = o.OrderDate,
            TotalAmount = o.TotalAmount,
            OrderItems = o.OrderItems.Select(oi => new OrderItemResponseDto
            {
                Id = oi.Id,
                ServiceId = oi.ServiceId,
                ServiceName = oi.Service?.Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            }).ToList()
        }).ToList();
    }

    /// <summary>
    /// Retrieves a specific order by its unique identifier.
    /// </summary>
    /// <param name="id">The ID of the order to retrieve.</param>
    /// <returns>The order entity if found; otherwise, null.</returns>
    public async Task<Order?> GetOrderByIdAsync(int id)
    {
        return await context.Orders
            .Include(o => o.OrderItems)
            .ThenInclude(oi => oi.Service)
            .FirstOrDefaultAsync(o => o.Id == id);
    }

    /// <summary>
    /// Creates a new order for the specified user after validating services.
    /// </summary>
    /// <param name="orderDto">The order details including items and quantities.</param>
    /// <param name="userId">The ID of the user placing the order.</param>
    /// <returns>The created order details as a DTO.</returns>
    public async Task<OrderResponseDto> CreateOrderAsync(OrderDto orderDto, string userId)
    {
        // Fetch all services in one query for efficiency
        var serviceIds = orderDto.OrderItems.Select(i => i.ServiceId).ToList();
        var services = await context.Services
            .Where(s => serviceIds.Contains(s.Id))
            .ToDictionaryAsync(s => s.Id);
        
        var newOrder = new Order
        {
            UserId = userId,
            OrderDate = DateTime.UtcNow,
            OrderItems = []
        };
        
        decimal totalAmount = 0;
        
        // Add order items, validating service availability
        foreach (var itemDto in orderDto.OrderItems)
        {
            if (services.TryGetValue(itemDto.ServiceId, out var service) &&
                service.Available)
            {
                var orderItem = new OrderItem
                {
                    ServiceId = service.Id,
                    Quantity = itemDto.Quantity,
                    Price = service.Price
                };
                
                newOrder.OrderItems.Add(orderItem);
                totalAmount += orderItem.Quantity * orderItem.Price;
            }
        }
        
        newOrder.TotalAmount = totalAmount;
        context.Orders.Add(newOrder);
        await context.SaveChangesAsync();
        
        // Transform to DTO for response
        var response = new OrderResponseDto
        {
            Id = newOrder.Id,
            OrderDate = newOrder.OrderDate,
            TotalAmount = newOrder.TotalAmount,
            OrderItems = [..newOrder.OrderItems.Select(oi => new OrderItemResponseDto
            {
                Id = oi.Id,
                ServiceId = oi.ServiceId,
                ServiceName = services[oi.ServiceId].Name,
                Quantity = oi.Quantity,
                Price = oi.Price
            })]
        };
        
        return response;
    }
}