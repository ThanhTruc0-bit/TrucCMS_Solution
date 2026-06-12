/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using System.Security.Claims;
using CMS.Data;

public class AccountController : Controller
{
    private readonly ApplicationDbContext _context;

    public AccountController(ApplicationDbContext context)
    {
        _context = context;
    }

    // =========================
    // LOGIN GET
    // =========================
    [HttpGet]
    public IActionResult Login()
    {
        return View();
    }

    // =========================
    // LOGIN POST
    // =========================
    [HttpPost]
    public async Task<IActionResult> Login(string username, string password)
    {
        try
        {
            var user = _context.Users
                .FirstOrDefault(u =>
                    u.Username == username &&
                    u.PasswordHash == password);

            if (user == null)
            {
                ViewBag.Error = "Sai tài khoản hoặc mật khẩu!";
                return View();
            }

            var role = user.Role?.Trim() ?? "User";

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, role),
                new Claim("FullName", user.FullName ?? "")
            };

            var identity = new ClaimsIdentity(
                claims,
                CookieAuthenticationDefaults.AuthenticationScheme
            );

            await HttpContext.SignInAsync(
                CookieAuthenticationDefaults.AuthenticationScheme,
                new ClaimsPrincipal(identity)
            );

            return RedirectToAction("Index", "Dashboard");
        }
        catch
        {
            ViewBag.Error = "Có lỗi xảy ra, vui lòng thử lại!";
            return View();
        }
    }

    // =========================
    // LOGOUT
    // =========================
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        return RedirectToAction("Login");
    }

    // =========================
    // ACCESS DENIED
    // =========================
    public IActionResult AccessDenied()
    {
        return View();
    }
}