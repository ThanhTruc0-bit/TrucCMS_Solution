/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ==========================
        // ĐĂNG KÝ
        // ==========================
        [HttpPost("CustomerRegister")]
        public IActionResult Register(Customer model)
        {
            // Check email đã tồn tại
            var exist = _context.Customers
                .FirstOrDefault(x => x.Email == model.Email);

            if (exist != null)
            {
                return BadRequest(new
                {
                    message = "Email đã tồn tại"
                });
            }

            _context.Customers.Add(model);
            _context.SaveChanges();

            return Ok(new
            {
                message = "Đăng ký thành công",
                customerId = model.Id,
                user = model
            });
        }

        // ==========================
        // ĐĂNG NHẬP (FIX LỖI 400)
        // ==========================
        [HttpPost("CustomerLogin")]
        public IActionResult Login([FromBody] LoginRequest login)
        {
            if (login == null)
            {
                return BadRequest(new
                {
                    message = "Dữ liệu không hợp lệ"
                });
            }

            var user = _context.Customers
                .FirstOrDefault(x =>
                    x.Email == login.Email &&
                    x.Password == login.Password);

            if (user == null)
            {
                return Unauthorized(new
                {
                    message = "Sai email hoặc mật khẩu"
                });
            }

            return Ok(new
            {
                message = "Đăng nhập thành công",
                customerId = user.Id,
                user = user
            });
        }
    }
}