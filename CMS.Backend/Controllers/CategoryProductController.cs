/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Controller danh mục sản phẩm
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        // Khai báo context
        private readonly ApplicationDbContext _context;

        // Constructor Injection
        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách danh mục sản phẩm
        public IActionResult Index()
        {
            var categoryProducts = _context.CategoriesProducts.ToList();

            return View(categoryProducts);
        }
    }
}