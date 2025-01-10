using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ProductAPI.Data;
using ProductAPI.Models;

namespace ProductAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _dbContext;

        public ProductsController(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        // api/products
        [HttpGet]
        public IActionResult GetAllProducts()
        {
            var products = _dbContext.Products.ToList();
            return Ok(products);
        }
        // api/products/id
        [HttpGet("{id}")]
        public IActionResult GetProductById(int id)
        {
            var product = _dbContext.Products.Find(id);
            if (product == null)
            {
                return NotFound("Product not found.");
            }

            return Ok(product);
        }

        // api/products
        [HttpPost]
        public IActionResult CreateProduct([FromForm] Product product)
        {
            if (product.Name == null || product.Price <= 0 || product.Stock < 0)
            {
                return BadRequest("Invalid Input.");
            }

            _dbContext.Products.Add(product);
            _dbContext.SaveChanges();

            return Ok(product);
        }

        // api/products/id
        [HttpPut]
        public IActionResult UpdateProduct(Product product)
        {
            //var existingProduct = _dbContext.Products.Find(id);
            //if (existingProduct == null)
            //{
            //    return NotFound("Product not found.");
            //}

            //existingProduct.Name = product.Name;
            //existingProduct.Price = product.Price;
            //existingProduct.Stock = product.Stock;

            //_dbContext.SaveChanges();

            return Ok("Product updated successfully.");
        }

        // api/products/id
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
