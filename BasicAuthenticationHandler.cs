using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using System;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ProductAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.Text.Encodings.Web;

public class BasicAuthenticationHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly AppDbContext _dbContext;

    public BasicAuthenticationHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        AppDbContext dbContext) : base(options, logger, encoder, clock)
    {
        _dbContext = dbContext;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
        {
            return Task.FromResult(AuthenticateResult.Fail("Missing Authorization Header"));
        }

        var authorizationHeader = Request.Headers["Authorization"].ToString();
        if (!authorizationHeader.StartsWith("Basic ", StringComparison.OrdinalIgnoreCase))
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
        }

        var token = authorizationHeader.Substring("Basic ".Length).Trim();
        var credentialBytes = Convert.FromBase64String(token);
        var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':');
        if (credentials.Length != 2)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Authorization Header"));
        }

        var username = credentials[0];
        var password = credentials[1];

        // Validate the credentials
        var user = _dbContext.Users.FirstOrDefault(u => u.Username == username && u.Password == password);
        if (user == null)
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid Credentials"));
        }

        var claims = new[] { new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Name, username) };
        var identity = new System.Security.Claims.ClaimsIdentity(claims, "Basic");
        var principal = new System.Security.Claims.ClaimsPrincipal(identity);
        var ticket = new AuthenticationTicket(principal, "Basic");

        return Task.FromResult(AuthenticateResult.Success(ticket));
    }
}
