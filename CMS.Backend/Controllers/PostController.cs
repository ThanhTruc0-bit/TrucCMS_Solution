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
using Microsoft.EntityFrameworkCore;

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

        // Hàm Index: Hiển thị danh sách bài viết
        public IActionResult Index(int? id)
        {
            // Lấy danh sách bài viết và kèm thông tin Category
            var posts = _context.Posts
                                .Include(p => p.Category)
                                .OrderByDescending(p => p.CreatedDate);

            // Nếu có id thì lọc theo danh mục
            if (id != null)
            {
                posts = posts.Where(p => p.CategoryId == id)
                             .OrderByDescending(p => p.CreatedDate);
            }

            // Trả dữ liệu về View
            return View(posts.ToList());
        }

        // Hàm Details: Hiển thị chi tiết bài viết
        // GET: Post/Details/5
        public IActionResult Details(int id)
        {
            // 1. Truy vấn bài viết theo ID
            // Sử dụng .Include(p => p.Category) để lấy kèm thông tin Danh mục (Join bảng)
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            // 2. Kiểm tra nếu không tìm thấy bài viết (tránh lỗi màn hình trắng)
            if (post == null)
            {
                return NotFound(); // Trả về trang lỗi 404
            }

            // 3. Truyền dữ liệu sang View
            return View(post);
        }
    }
}