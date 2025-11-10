using Microsoft.EntityFrameworkCore;

namespace Backend.DTOs;
public class ProductDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    [Precision(18,2)]
    public decimal Price { get; set; }
    public string? ImageUrl { get; set; }
    public int Stock { get; set; }
    public string? Category { get; set; }
}
