/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */

using CMS.Data;
using CMS.Data.Entities; // Phải có dòng này để dùng lớp User
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers

{

    [Authorize(Roles = "Admin")]
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
        // GET: Hiển thị form thêm thành viên
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Create(User model)
        {
            // Kiểm tra xem tên đăng nhập đã tồn tại chưa
            var checkExist = _context.Users.Any(u => u.Username == model.Username);

            if (checkExist)
            {
                ModelState.AddModelError("Username", "Tên đăng nhập này đã có người dùng!");
                return View(model);
            }

            // Lưu User mới vào Database
            _context.Users.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
        // GET: Hiển thị form kèm dữ liệu cũ của User
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var user = _context.Users.Find(id);
            if (user == null) return NotFound();

            return View(user);
        }

        // POST: Thực hiện lưu thay đổi
        [HttpPost]
        public IActionResult Edit(User model, string NewPassword)
        {
            // 1. Tìm User gốc trong Database để lấy lại mật khẩu cũ nếu cần
            var existingUser = _context.Users.AsNoTracking().FirstOrDefault(u => u.Id == model.Id);

            if (existingUser == null) return NotFound();

            // 2. Xử lý mật khẩu: Nếu nhập mới thì lấy cái mới, nếu trống thì lấy cái cũ
            if (!string.IsNullOrEmpty(NewPassword))
            {
                model.PasswordHash = NewPassword; // Sau này sẽ mã hóa tại đây
            }
            else
            {
                model.PasswordHash = existingUser.PasswordHash;
            }

            // 3. Cập nhật vào Database
            _context.Users.Update(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }
        public IActionResult Delete(int id)
        {
            var user = _context.Users.Find(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }


    }
}