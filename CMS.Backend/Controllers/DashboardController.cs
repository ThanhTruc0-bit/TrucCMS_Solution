/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class DashboardController : Controller
    {
        private readonly ApplicationDbContext _context;

        public DashboardController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            ViewBag.Products = _context.Products.Count();
            ViewBag.Customers = _context.Customers.Count();
            ViewBag.Orders = _context.Orders.Count();
            ViewBag.Revenue = _context.OrderDetails
                .Sum(x => x.Quantity * x.UnitPrice);

            return View();
        }
    }
}