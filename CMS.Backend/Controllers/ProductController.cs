/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Controller sản phẩm
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách sản phẩm
        public IActionResult Index()
        {
            var products = _context.Products.ToList();

            return View(products);
        }
    }
}