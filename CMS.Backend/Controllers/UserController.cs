/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User

namespace CMS.Backend.Controllers
{
    public class UserController : Controller
    {
        // Khai báo biến context
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public UserController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách thành viên quản trị
        public IActionResult Index()
        {
            // Lấy danh sách User từ Database
            var users = _context.Users.ToList();

            // Trả về View kèm theo danh sách người dùng
            return View(users);
        }
    }
}