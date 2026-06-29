using BCrypt.Net;
using CMS.Backend.Models;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
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
                UserId = user.Id,
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
                .FirstOrDefault(c => c.UserId == user.Id);

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
                    email = customer.Email,
                    phone = customer.Phone,
                    address = customer.Address
                },

                customerId = customer.Id
            });
        }

        // ================= FORGOT PASSWORD =================
        [HttpPost("forgot-password")]
        public IActionResult ForgotPassword([FromBody] ForgotPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email))
                return BadRequest(new { message = "Vui lòng nhập email" });

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email);

            if (customer == null)
                return BadRequest(new { message = "Email không tồn tại trong hệ thống" });

            if (customer.UserId == null)
                return BadRequest(new { message = "Tài khoản khách hàng chưa được liên kết User" });

            var user = _context.Users
                .FirstOrDefault(u => u.Id == customer.UserId);

            if (user == null)
                return BadRequest(new { message = "Không tìm thấy tài khoản người dùng" });

            var token = Guid.NewGuid().ToString("N");

            user.ResetPasswordToken = token;
            user.ResetPasswordTokenExpires = DateTime.Now.AddMinutes(30);

            _context.SaveChanges();

            var frontendUrl = _configuration["FrontendUrl"] ?? "http://localhost:3000";

            var resetLink =
                $"{frontendUrl}/reset-password?email={Uri.EscapeDataString(customer.Email)}&token={token}";

            SendResetPasswordEmail(customer.Email, customer.FullName, resetLink);

            return Ok(new
            {
                message = "Link đặt lại mật khẩu đã được gửi đến email của bạn"
            });
        }

        // ================= RESET PASSWORD =================
        [HttpPost("reset-password")]
        public IActionResult ResetPassword([FromBody] ResetPasswordRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Token) ||
                string.IsNullOrWhiteSpace(request.NewPassword))
            {
                return BadRequest(new { message = "Vui lòng nhập đầy đủ thông tin" });
            }

            var customer = _context.Customers
                .FirstOrDefault(c => c.Email == request.Email);

            if (customer == null)
                return BadRequest(new { message = "Email không tồn tại" });

            if (customer.UserId == null)
                return BadRequest(new { message = "Tài khoản khách hàng chưa được liên kết User" });

            var user = _context.Users
                .FirstOrDefault(u =>
                    u.Id == customer.UserId &&
                    u.ResetPasswordToken == request.Token);

            if (user == null)
                return BadRequest(new { message = "Token không hợp lệ" });

            if (user.ResetPasswordTokenExpires == null ||
                user.ResetPasswordTokenExpires < DateTime.Now)
            {
                return BadRequest(new { message = "Token đã hết hạn" });
            }

            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.ResetPasswordToken = null;
            user.ResetPasswordTokenExpires = null;

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đặt lại mật khẩu thành công"
            });
        }

        private void SendResetPasswordEmail(string toEmail, string fullName, string resetLink)
        {
            var smtpServer = _configuration["EmailSettings:SmtpServer"];
            var port = int.Parse(_configuration["EmailSettings:Port"] ?? "587");
            var senderName = _configuration["EmailSettings:SenderName"];
            var senderEmail = _configuration["EmailSettings:SenderEmail"];
            var password = _configuration["EmailSettings:Password"];

            var mail = new MailMessage();
            mail.From = new MailAddress(senderEmail, senderName);
            mail.To.Add(toEmail);
            mail.Subject = "Đặt lại mật khẩu - Luxury Jewelry";
            mail.IsBodyHtml = true;

            mail.Body = $@"
                <div style='font-family: Arial; line-height: 1.7'>
                    <h2>Xin chào {fullName},</h2>
                    <p>Bạn vừa yêu cầu đặt lại mật khẩu cho tài khoản Luxury Jewelry.</p>
                    <p>Vui lòng bấm vào nút bên dưới để đặt lại mật khẩu:</p>

                    <p>
                        <a href='{resetLink}'
                           style='display:inline-block;background:#f59e0b;color:#000;
                                  padding:12px 20px;border-radius:30px;
                                  text-decoration:none;font-weight:bold'>
                            Đặt lại mật khẩu
                        </a>
                    </p>

                    <p>Link này có hiệu lực trong 30 phút.</p>
                    <p>Nếu bạn không yêu cầu, vui lòng bỏ qua email này.</p>
                </div>
            ";

            using var smtp = new SmtpClient(smtpServer, port);
            smtp.Credentials = new NetworkCredential(senderEmail, password);
            smtp.EnableSsl = true;

            smtp.Send(mail);
        }
    }

    public class ForgotPasswordRequest
    {
        public string Email { get; set; }
    }

    public class ResetPasswordRequest
    {
        public string Email { get; set; }

        public string Token { get; set; }

        public string NewPassword { get; set; }
    }
}