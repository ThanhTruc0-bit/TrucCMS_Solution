using CMS.Backend.Models;
using CMS.Backend.Services;
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
        private readonly EmailService _emailService;

        // FIX: inject EmailService
        public OrdersController(ApplicationDbContext context, EmailService emailService)
        {
            _context = context;
            _emailService = emailService;
        }

        [HttpPost]
        public IActionResult Create([FromBody] OrderRequest request)
        {
            if (request == null || request.Items == null || !request.Items.Any())
            {
                return BadRequest(new { message = "Giỏ hàng trống" });
            }

            var customer = _context.Customers.FirstOrDefault(c => c.Id == request.CustomerId);

            if (customer == null)
            {
                return BadRequest(new { message = "Customer không tồn tại" });
            }

            using var transaction = _context.Database.BeginTransaction();

            try
            {
                var order = new Order
                {
                    CustomerId = request.CustomerId,
                    OrderDate = DateTime.Now,
                    Status = 0,
                    Notes = request.Notes ?? ""
                };

                _context.Orders.Add(order);
                _context.SaveChanges();

                foreach (var item in request.Items)
                {
                    var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);

                    // FIX: dùng throw thay vì return
                    if (product == null)
                        throw new Exception("Product không tồn tại");

                    if (item.Quantity <= 0)
                        throw new Exception("Số lượng không hợp lệ");

                    if (product.StockQuantity < item.Quantity)
                        throw new Exception($"Không đủ tồn kho: {product.Name}");

                    _context.OrderDetails.Add(new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    });

                    // FIX: thiếu trừ kho
                    product.StockQuantity -= item.Quantity;
                }

                _context.SaveChanges();
                transaction.Commit();

                // FIX: gửi mail sau commit
                var emailBody = $@"
                    <h2>🎉 Đặt hàng thành công</h2>
                    <p>Mã đơn: <b>{order.Id}</b></p>
                    <p>Ngày: {order.OrderDate}</p>
                    <p>Cảm ơn bạn đã mua hàng 💎</p>
                ";

                _emailService.Send(customer.Email, "Xác nhận đơn hàng", emailBody);

                // FIX: thiếu return Ok
                return Ok(new
                {
                    message = "Đặt hàng thành công",
                    orderId = order.Id
                });
            }
            catch (Exception ex)
            {
                transaction.Rollback();
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var order = _context.Orders
                .Include(o => o.OrderDetails)
                .FirstOrDefault(o => o.Id == id);

            if (order == null) return NotFound();

            return Ok(new
            {
                order.Id,
                order.OrderDate,
                order.Status,
                order.Notes,
                Details = order.OrderDetails.Select(d => new
                {
                    d.ProductId,
                    d.Quantity,
                    d.UnitPrice
                })
            });
        }
    }
}