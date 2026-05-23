/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoryController : Controller
    {

        // Khai báo biến context
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public CategoryController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách danh mục
        public IActionResult Index()
        {
            var categories = _context.Categories.ToList();

            return View(categories);
        }

        // GET: Hiển thị giao diện form thêm danh mục
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Nhận dữ liệu từ form và lưu vào database
        [HttpPost]
        public IActionResult Create(Category model)
        {
            // BƯỚC 1: Thêm dữ liệu vào bộ nhớ tạm EF
            _context.Categories.Add(model);

            // BƯỚC 2: Lưu dữ liệu xuống SQL Server
            _context.SaveChanges();

            // BƯỚC 3: Quay về trang danh sách
            return RedirectToAction("Index");
        }

        // Action nhận vào Id của danh mục cần xóa
        public IActionResult Delete(int id)
        {
            // Bước 1: Tìm đối tượng danh mục trong Database bằng Id
            var category = _context.Categories.Find(id);

            // Kiểm tra nếu không tồn tại
            if (category == null)
            {
                return NotFound();
            }

            // Kiểm tra danh mục có bài viết không
            bool hasPosts = _context.Posts
                                    .Any(p => p.CategoryId == id);

            // Nếu có bài viết thì không cho xóa
            if (hasPosts)
            {
                TempData["Error"] =
                    "Không thể xóa danh mục này vì đang chứa bài viết.";

                return RedirectToAction("Index");
            }

            // Bước 2: Lệnh xóa khỏi bộ nhớ tạm
            _context.Categories.Remove(category);

            // Bước 3: Xóa thật trong SQL Server
            _context.SaveChanges();

            TempData["Success"] =
                "Xóa danh mục thành công.";

            // Quay lại trang danh sách
            return RedirectToAction("Index");
        }

        // 1. Hàm GET: Tìm dữ liệu cũ và đổ lên Form
        [HttpGet]
        public IActionResult Edit(int id)
        {
            // Tìm danh mục trong Database theo Id
            var category = _context.Categories.Find(id);

            if (category == null)
                return NotFound();

            return View(category);
        }

        // 2. Hàm POST: Nhận dữ liệu mới từ người dùng và lưu lại
        [HttpPost]
        public IActionResult Edit(Category model)
        {
            // Lệnh cập nhật đối tượng vào bộ nhớ tạm
            _context.Categories.Update(model);

            // Lưu thay đổi xuống SQL Server
            _context.SaveChanges();

            // Quay lại trang danh sách
            return RedirectToAction("Index");
        }
    }
}