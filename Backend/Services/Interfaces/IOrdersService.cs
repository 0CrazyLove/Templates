using Backend.DTOs;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IOrdersService
{
    Task<IEnumerable<Order>> GetOrdersAsync();
    Task<Order?> GetOrderByIdAsync(int id);
    Task<Order> CreateOrderAsync(OrderDto orderDto);
}