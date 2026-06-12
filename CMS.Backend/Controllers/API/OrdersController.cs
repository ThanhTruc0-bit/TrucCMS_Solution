/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using CMS.Backend.Models;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public IActionResult Create(OrderRequest request)
        {
            var order = new Order
            {
                CustomerId = request.CustomerId,
                OrderDate = DateTime.Now,
                Status = 0,
                Notes = request.Notes
            };

            _context.Orders.Add(order);
            _context.SaveChanges();

            foreach (var item in request.Items)
            {
                var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);

                if (product == null)
                    return BadRequest($"Product {item.ProductId} not found");

                // ❗ FIX 1: check tồn kho
                if (item.Quantity > product.StockQuantity)
                {
                    return BadRequest($"Sản phẩm {product.Name} không đủ số lượng");
                }

                var detail = new OrderDetail
                {
                    OrderId = order.Id,
                    ProductId = item.ProductId,
                    Quantity = item.Quantity,
                    UnitPrice = product.Price
                };

                product.StockQuantity -= item.Quantity;

                _context.OrderDetails.Add(detail);
            }

            _context.SaveChanges();

            return Ok(new
            {
                message = "Đặt hàng thành công",
                orderId = order.Id
            });
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails) // ❗ FIX 2
                .Where(o => o.CustomerId == customerId)
                .Select(o => new
                {
                    o.Id,
                    o.OrderDate,
                    o.Status,
                    o.Notes,
                    Details = o.OrderDetails.Select(d => new
                    {
                        d.ProductId,
                        d.Quantity,
                        d.UnitPrice
                    })
                })
                .ToList();

            return Ok(orders);
        }
    }
}