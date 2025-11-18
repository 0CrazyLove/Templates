namespace Backend.DTOs.Orders;

/// <summary>
/// Request DTO for creating a new order with multiple items.
/// </summary>
public class OrderDto
{
    /// <summary>
    /// Gets or sets the collection of items to be ordered.
    /// </summary>
    public IList<OrderItemDto> OrderItems { get; set; } = [];
}
