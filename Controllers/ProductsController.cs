using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ProductAPI.Data;
using ProductAPI.Models;

namespace ProductAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ProductsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        // Fetch all products
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _dbContext.Products.ToList();
            return Ok(products);


        // Fetch a single product by ID
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _dbContext.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);

        // Add a new product
        [HttpPost]
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);

            return CreatedAtAction(nameof(GetProductById), new { id = product.Id }, product);
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, [FromForm] Product product)
        [HttpPut("{id}")]
        public IActionResult UpdateProduct(int id, [FromForm] Product product)
        {
            //var existingProduct = _dbContext.Products.Find(id);
            //if (existingProduct == null)
            //{
            //    return NotFound("Product not found.");
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.Stock = product.Stock;
            existingProduct.Name = product.Name;
            existingProduct.Price = product.Price;
            existingProduct.Stock = product.Stock;

            //_dbContext.SaveChanges();

        }

        // Remove a product
        [HttpDelete("{id}")]
        public IActionResult DeleteProduct(int id)
        {
            var product = _dbContext.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            _dbContext.Products.Remove(product);
            _dbContext.SaveChanges();

            return Ok("Product deleted successfully.");
        }
    }
}
