/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Controller khách hàng
 */

using Microsoft.AspNetCore.Mvc;
using CMS.Data;

namespace CMS.Backend.Controllers
{
    public class CustomerController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CustomerController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Hiển thị danh sách khách hàng
        public IActionResult Index()
        {
            var customers = _context.Customers.ToList();

            return View(customers);
        }
    }
}