using Microsoft.AspNetCore.Authorization;
using Backend.Models;
using Backend.DTOs;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using System.Security.Claims;
namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController(IOrdersService ordersService) : ControllerBase
{
    // GET: api/orders
    [HttpGet]
    [Authorize]
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        // In a real app, you'd filter by user
        var orders = await ordersService.GetOrdersAsync();
        return Ok(orders);
    }

    // GET: api/orders/{id}
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await ordersService.GetOrderByIdAsync(id);
        if (order == null)
        {
            return NotFound();
        }
        return Ok(order);
    }

    // POST: api/orders
    [HttpPost]
    [Authorize(Policy = "CustomerPolicy")]
    public async Task<ActionResult<Order>> CreateOrder(OrderDto orderDto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;
        var newOrder = await ordersService.CreateOrderAsync(orderDto, userId);
        return CreatedAtAction(nameof(GetOrder), new { id = newOrder.Id }, newOrder);
    }

}
