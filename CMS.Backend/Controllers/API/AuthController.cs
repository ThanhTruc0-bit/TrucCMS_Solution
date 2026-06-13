using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= REGISTER =================
        [HttpPost("register")]
        public IActionResult Register([FromBody] User request)
        {
            var exists = _context.Users.Any(x => x.Username == request.Username);

            if (exists)
                return BadRequest(new { message = "Username đã tồn tại" });

            var user = new User
            {
                Username = request.Username,
                PasswordHash = request.PasswordHash,
                FullName = request.FullName,
                Role = "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok(new { message = "Đăng ký thành công" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] User request)
        {
            var user = _context.Users.FirstOrDefault(x =>
                x.Username == request.Username &&
                x.PasswordHash == request.PasswordHash);

            if (user == null)
                return BadRequest(new { message = "Sai tài khoản hoặc mật khẩu" });

            return Ok(new
            {
                message = "Đăng nhập thành công",
                user = new
                {
                    user.Id,
                    user.Username,
                    user.FullName,
                    user.Role
                }
            });
        }
    }
}