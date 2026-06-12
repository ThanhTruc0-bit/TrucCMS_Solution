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
using Microsoft.AspNetCore.Authorization;
using System.Linq;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin,Editor")]
    public class OrderController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderController(ApplicationDbContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            var orders = _context.Orders
                .Include(o => o.Customer)
                .ToList();

            return View(orders);
        }

        public IActionResult Details(int id)
        {
            var order = _context.Orders
                .Include(o => o.Customer)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            var orderDetails = _context.OrderDetails
                .Include(od => od.Product)
                .Where(od => od.OrderId == id)
                .ToList();

            ViewBag.OrderDetails = orderDetails;

            return View(order);
        }

        [HttpGet]
        public IActionResult Edit(int id)
        {
            var order = _context.Orders.Find(id);
            if (order == null) return NotFound();

            ViewBag.Customers = _context.Customers.ToList();
            return View(order);
        }

        [HttpPost]
        public IActionResult Edit(Order model)
        {
            if (ModelState.IsValid)
            {
                _context.Orders.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.Customers = _context.Customers.ToList();
            return View(model);
        }

        public IActionResult Delete(int id)
        {
            var order = _context.Orders.Find(id);

            if (order != null)
            {
                _context.Orders.Remove(order);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}