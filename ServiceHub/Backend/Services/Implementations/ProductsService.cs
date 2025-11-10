using Backend.Data;
using Backend.Models;
using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Backend.Services.Implementations;

public class ProductsService(AppDbContext context) : IProductsService
{
    public async Task<IEnumerable<Product>> GetProducts(string? category, int page, int pageSize)
    {
        var query = context.Products.AsQueryable();

        if (!string.IsNullOrEmpty(category))
        {
            query = query.Where(p => p.Category == category);
        }

        return await query.Skip((page - 1) * pageSize).Take(pageSize).ToListAsync();
    }

    public async Task<Product?> GetProductById(int id)
    {
        return await context.Products.FindAsync(id);
    }
    public async Task<Product> CreateProduct(ProductDto productDto)
    {
        var newProduct = new Product
        {
            Name = productDto.Name,
            Description = productDto.Description,
            Price = productDto.Price,
            ImageUrl = productDto.ImageUrl,
            Stock = productDto.Stock,
            Category = productDto.Category
        };
        context.Products.Add(newProduct);
        await context.SaveChangesAsync();
        return newProduct;
    }

    public async Task<Product?> UpdateProduct(int id, ProductDto productDto)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) return null;

        product.Name = productDto.Name;
        product.Description = productDto.Description;
        product.Price = productDto.Price;
        product.ImageUrl = productDto.ImageUrl;
        product.Stock = productDto.Stock;
        product.Category = productDto.Category;

        await context.SaveChangesAsync();
        return product;
    }

    public async Task<bool> DeleteProduct(int id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) return false;

        context.Products.Remove(product);
        await context.SaveChangesAsync();
        return true;
    }
}

