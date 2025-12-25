using Microsoft.EntityFrameworkCore;
namespace Backend.DTOs.Orders;

/// <summary>
/// Response DTO for an order item with detailed information.
/// </summary>
public class OrderItemResponseDto
{
    /// <summary>
    /// Gets or sets the order item ID.
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the service ID.
    /// </summary>
    public int ServiceId { get; set; }

    /// <summary>
    /// Gets or sets the service name at purchase time.
    /// </summary>
    public string? ServiceName { get; set; }

    /// <summary>
    /// Gets or sets the quantity purchased.
    /// </summary>
    public int Quantity { get; set; }

    /// <summary>
    /// Gets or sets the unit price at purchase time.
    /// </summary>
    [Precision(18, 2)]
    public decimal Price { get; set; }
}