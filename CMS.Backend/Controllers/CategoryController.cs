using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    public class CategoryController : Controller
    {
        public IActionResult Index()
        {
            // Tạo danh sách dữ liệu mẫu trực tiếp trong code
            var list = new List<Category> {
            new Category { Id = 1, Name = "Tin Công Nghệ", Description = "Review Laptop, AI" },
            new Category { Id = 2, Name = "Giáo Dục", Description = "Thông tin tuyển sinh" }
        };
            return View(list); // Gửi danh sách này sang giao diện
        }
    }

}
