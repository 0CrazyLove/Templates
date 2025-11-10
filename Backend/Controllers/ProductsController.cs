using Backend.Models;
using Backend.DTOs;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
namespace Backend.Controllers;

[ApiController]
[Authorize(Policy = "AdminPolicy")]
[Route("api/[controller]")]
public class ProductsController(IProductsService productsService) : ControllerBase
{
    // GET: api/products
    [HttpGet]
    [AllowAnonymous]
    public async Task<ActionResult<IEnumerable<Product>>> GetProducts([FromQuery] string? category, [FromQuery] int page = 1, [FromQuery] int pageSize = 10)
    {
        var paginatedProducts = await productsService.GetProducts(category, page, pageSize);
        return Ok(paginatedProducts);
    }

    // GET: api/products/{id}
    [HttpGet("{id}")]
    [AllowAnonymous]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        var product = await productsService.GetProductById(id);
        if (product == null) return NotFound();
        
        return Ok(product);
    }
    
    // POST: api/products
    [HttpPost]
    public async Task<ActionResult<Product>> CreateProduct(ProductDto productDto)
    {
        var newProduct = await productsService.CreateProduct(productDto);
        return CreatedAtAction(nameof(GetProduct), new { id = newProduct.Id }, newProduct);
    }

    // PUT: api/products/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProduct(int id, ProductDto productDto)
    {
        var updatedProduct = await productsService.UpdateProduct(id, productDto);
        if (updatedProduct == null)return NotFound();
    
        return NoContent();
    }

    // DELETE: api/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProduct(int id)
    {
        var result = await productsService.DeleteProduct(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }
}
