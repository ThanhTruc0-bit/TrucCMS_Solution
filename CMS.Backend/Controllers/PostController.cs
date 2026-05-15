/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers
{
    public class PostController : Controller
    {
        // Khai báo biến context
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hàm Index: Hiển thị danh sách bài viết từ Database
        public IActionResult Index()
        {
            // Lấy danh sách bài viết từ Database
            var posts = _context.Posts.ToList();

            // Gửi danh sách dữ liệu sang View
            return View(posts);
        }

        // Hàm Details: Hiển thị chi tiết bài viết
        public IActionResult Details(int id)
        {
            // Tìm bài viết theo Id trong Database
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy
            if (post == null)
            {
                return NotFound();
            }

            return View(post);
        }
    }
}