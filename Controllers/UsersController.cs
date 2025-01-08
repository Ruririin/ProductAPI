using Microsoft.AspNetCore.Mvc;
using ProductAPI.Data;
using ProductAPI.Models;

[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly AppDbContext _dbContext;

    public UserController(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpPost("register")]
    public IActionResult Register([FromForm] User user)
    {
        if (_dbContext.Users.Any(u => u.Username == user.Username))
        {
            return BadRequest("Username already exists.");
        }

        _dbContext.Users.Add(user);
        _dbContext.SaveChanges();
        return Ok("User registered successfully.");
    }

    [HttpPost("login")]
    public IActionResult Login([FromForm] string username, [FromForm] string password)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
        if (user == null)
        {
            return Unauthorized("Invalid credentials.");
        }

        return Ok("Login successful.");
    }
}
