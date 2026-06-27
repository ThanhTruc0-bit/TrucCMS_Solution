using BCrypt.Net;
using CMS.Backend.Models;
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
        public IActionResult Register([FromBody] RegisterRequest request)
        {
            var exists = _context.Users.Any(x => x.Username == request.Username);

            if (exists)
                return BadRequest(new { message = "Username đã tồn tại" });

            var emailExists = _context.Customers.Any(c => c.Email == request.Email);

            if (emailExists)
                return BadRequest(new { message = "Email đã tồn tại" });

            var user = new User
            {
                Username = request.Username,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash),
                FullName = request.FullName,
                Role = "User"
            };

            _context.Users.Add(user);
            _context.SaveChanges();

            var customer = new Customer
            {
                FullName = request.FullName,
                Email = request.Email,
                Phone = request.Phone,
                Address = request.Address
            };

            _context.Customers.Add(customer);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công"
            });
        }

        // ================= LOGIN =================
        [HttpPost("login")]
        public IActionResult Login([FromBody] User request)
        {
            var user = _context.Users.FirstOrDefault(x => x.Username == request.Username);

            if (user == null ||
                !BCrypt.Net.BCrypt.Verify(request.PasswordHash, user.PasswordHash))
            {
                return BadRequest(new { message = "Sai tài khoản hoặc mật khẩu" });
            }

            var customer = _context.Customers
                .FirstOrDefault(c => c.FullName == user.FullName);

            if (customer == null)
            {
                return BadRequest(new { message = "Không tìm thấy Customer" });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",

                user = new
                {
                    id = user.Id,
                    username = user.Username,
                    fullName = user.FullName,
                    role = user.Role,

                    // THÊM 3 DÒNG NÀY ĐỂ CHECKOUT TỰ HIỆN
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                },

                customerId = customer.Id
            });
        }
    }
}