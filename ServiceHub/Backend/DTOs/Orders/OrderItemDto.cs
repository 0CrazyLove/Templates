namespace Backend.DTOs.Orders;

/// <summary>
/// DTO representing a single item within an order.
/// </summary>
public class OrderItemDto
{
    /// <summary>
    /// Gets or sets the service ID to be ordered.
    /// </summary>
    public int ServiceId { get; set; }

    /// <summary>
    /// Gets or sets the quantity of the service to purchase.
    /// </summary>
    public int Quantity { get; set; }
}
