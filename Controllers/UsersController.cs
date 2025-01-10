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
    public IActionResult Login([FromBody] User loginUser)
    {
        var user = _dbContext.Users.FirstOrDefault(u => u.Username == loginUser.Username && u.Password == loginUser.Password);
        if (user == null)
        {
            return Unauthorized(new { message = "Invalid credentials" }); 
        }

        return Ok(new { message = "Login successful" }); 
    }
}
