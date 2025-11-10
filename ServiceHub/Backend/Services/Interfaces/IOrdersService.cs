using Backend.DTOs;
using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IOrdersService
{
    Task<IEnumerable<OrderResponseDto>> GetOrdersAsync();
    Task<Order?> GetOrderByIdAsync(int id);
    Task<OrderResponseDto> CreateOrderAsync(OrderDto orderDto, string userId);
}
