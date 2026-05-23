/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Quản lý bài viết
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin,Editor")]

    public class PostController : Controller
    {
        // Khai báo biến context
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public PostController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // INDEX
        // =========================
        // Hiển thị danh sách bài viết
        public IActionResult Index(int? id)
        {
            // Lấy danh sách bài viết và kèm Category
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

        // =========================
        // DETAILS
        // =========================
        // Hiển thị chi tiết bài viết
        public IActionResult Details(int id)
        {
            // Truy vấn bài viết theo ID
            // Include dùng để Join Category
            var post = _context.Posts
                               .Include(p => p.Category)
                               .FirstOrDefault(p => p.Id == id);

            // Nếu không tìm thấy
            if (post == null)
            {
                return NotFound();
            }

            // Trả dữ liệu sang View
            return View(post);
        }

        // =========================
        // CREATE - GET
        // =========================
        // Hiển thị form thêm bài viết
        [HttpGet]
        public IActionResult Create()
        {
            // Đổ dữ liệu Category vào Dropdown
            ViewBag.CategoryList =
                new SelectList(_context.Categories,
                               "Id",
                               "Name");

            return View();
        }

        // =========================
        // CREATE - POST
        // =========================
        // Nhận dữ liệu từ Form
        [HttpPost]
        public IActionResult Create(Post model, IFormFile uploadImage)
        {
            // Kiểm tra upload ảnh
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // 1. Đường dẫn thư mục uploads
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                // 2. Tạo thư mục nếu chưa tồn tại
                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                // 3. Tạo tên file duy nhất
                string fileName =
                    Guid.NewGuid().ToString()
                    + Path.GetExtension(uploadImage.FileName);

                // 4. Tạo đường dẫn file
                string filePath =
                    Path.Combine(folder, fileName);

                // 5. Copy file vào thư mục
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // 6. Lưu đường dẫn ảnh vào database
                model.ImageUrl = "/uploads/" + fileName;
            }

            // Tự động lấy ngày hiện tại
            model.CreatedDate = DateTime.Now;

            // Thêm dữ liệu vào database
            _context.Posts.Add(model);

            // Lưu xuống SQL Server
            _context.SaveChanges();

            // Quay về trang danh sách
            return RedirectToAction("Index");
        }
        public IActionResult Delete(int id)
        {
            // 1. Tìm bài viết theo Id
            var post = _context.Posts.Find(id);

            if (post != null)
            {
                // 2. Xóa khỏi bộ nhớ tạm
                _context.Posts.Remove(post);

                // 3. Cập nhật xuống SQL Server
                _context.SaveChanges();
            }
            return RedirectToAction("Index");
        }
        // GET: Hiển thị form kèm dữ liệu cũ
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var post = _context.Posts.Find(id);
            if (post == null) return NotFound();

            // Chuẩn bị lại danh sách danh mục để người dùng có thể đổi chuyên mục
            ViewBag.CategoryList = new SelectList(_context.Categories, "Id", "Name", post.CategoryId);
            return View(post);
        }

        // POST: Thực hiện cập nhật
        [HttpPost]
        public IActionResult Edit(Post model, IFormFile uploadImage)
        {
            // Bước 1: Kiểm tra xem người dùng có chọn file ảnh mới không
            if (uploadImage != null && uploadImage.Length > 0)
            {
                // Thực hiện quy trình upload giống như trang Create
                string folder = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
                if (!Directory.Exists(folder)) Directory.CreateDirectory(folder);

                string fileName = Guid.NewGuid().ToString() + Path.GetExtension(uploadImage.FileName);
                string filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                // Cập nhật đường dẫn ảnh mới vào model
                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                // Bước quan trọng: Nếu không upload ảnh mới, chúng ta phải giữ lại ảnh cũ
                // Chúng ta cần lấy lại giá trị ImageUrl từ Database để tránh bị ghi đè thành rỗng
                var oldPost = _context.Posts.AsNoTracking().FirstOrDefault(p => p.Id == model.Id);
                if (oldPost != null && string.IsNullOrEmpty(model.ImageUrl))
                {
                    model.ImageUrl = oldPost.ImageUrl;
                }
            }
            _context.Posts.Update(model);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }


    }
}