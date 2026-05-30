/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using CMS.Data;
using CMS.Data.Entities;
using System.Linq;

namespace CMS.Backend.Controllers
{
    public class OrderDetailController : Controller
    {
        private readonly ApplicationDbContext _context;

        public OrderDetailController(ApplicationDbContext context)
        {
            _context = context;
        }

        // LIST
        public IActionResult Index()
        {
            var orderDetails = _context.OrderDetails
                .Include(x => x.Product)
                .Include(x => x.Order)
                .ToList();

            return View(orderDetails);
        }

        // EDIT GET
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var detail = _context.OrderDetails.Find(id);

            if (detail == null)
                return NotFound();

            return View(detail);
        }

        // EDIT POST
        [HttpPost]
        public IActionResult Edit(OrderDetail model)
        {
            if (ModelState.IsValid)
            {
                _context.OrderDetails.Update(model);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }

            return View(model);
        }

        // DELETE
        public IActionResult Delete(int id)
        {
            var detail = _context.OrderDetails.Find(id);

            if (detail != null)
            {
                _context.OrderDetails.Remove(detail);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }
    }
}