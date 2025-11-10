using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;


namespace Backend.Models;

public class Order
{
    [Key]
    public int Id { get; set; }
    public string? UserId { get; set; }
    public IdentityUser? User { get; set; }
    public DateTime OrderDate { get; set; }
    [Precision(18,2)]
    public decimal TotalAmount { get; set; }
    public IList<OrderItem> OrderItems { get; set; } = [];
}
