using CMS.Backend.Models;
using CMS.Backend.Services;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly EmailService _emailService;

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

                var emailItems = new List<OrderEmailItem>();

                foreach (var item in request.Items)
                {
                    var product = _context.Products.FirstOrDefault(p => p.Id == item.ProductId);

                    if (product == null)
                        throw new Exception("Product không tồn tại");

                    if (item.Quantity <= 0)
                        throw new Exception("Số lượng không hợp lệ");

                    if (product.StockQuantity < item.Quantity)
                        throw new Exception($"Không đủ tồn kho: {product.Name}");

                    var orderDetail = new OrderDetail
                    {
                        OrderId = order.Id,
                        ProductId = product.Id,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price
                    };

                    _context.OrderDetails.Add(orderDetail);

                    product.StockQuantity -= item.Quantity;
                    product.SoldQuantity += item.Quantity;

                    emailItems.Add(new OrderEmailItem
                    {
                        ProductName = product.Name,
                        Quantity = item.Quantity,
                        UnitPrice = product.Price,
                        Amount = product.Price * item.Quantity
                    });
                }

                _context.SaveChanges();
                transaction.Commit();

                // Gửi email thông tin đơn hàng cho khách
                try
                {
                    var totalAmount = emailItems.Sum(x => x.Amount);

                    var itemRows = string.Join("", emailItems.Select(x => $@"
                        <tr>
                            <td style='padding:10px;border-bottom:1px solid #eee'>{x.ProductName}</td>
                            <td style='padding:10px;border-bottom:1px solid #eee;text-align:center'>{x.Quantity}</td>
                            <td style='padding:10px;border-bottom:1px solid #eee;text-align:right'>{FormatMoney(x.UnitPrice)} đ</td>
                            <td style='padding:10px;border-bottom:1px solid #eee;text-align:right'>{FormatMoney(x.Amount)} đ</td>
                        </tr>
                    "));

                    var emailBody = $@"
                        <div style='font-family:Arial,sans-serif;line-height:1.6;color:#222'>
                            <h2 style='color:#b45309'>Luxury Jewelry - Xác nhận đơn hàng</h2>

                            <p>Xin chào <b>{customer.FullName}</b>,</p>
                            <p>Cảm ơn bạn đã đặt hàng tại <b>Luxury Jewelry</b>. Đơn hàng của bạn đã được ghi nhận thành công.</p>

                            <div style='background:#fff7ed;border:1px solid #fed7aa;border-radius:12px;padding:14px;margin:16px 0'>
                                <p><b>Mã đơn hàng:</b> #{order.Id}</p>
                                <p><b>Ngày đặt:</b> {order.OrderDate:dd/MM/yyyy HH:mm}</p>
                                <p><b>Email:</b> {customer.Email}</p>
                                <p><b>Số điện thoại:</b> {customer.Phone}</p>
                                <p><b>Địa chỉ:</b> {customer.Address}</p>
                                <p><b>Ghi chú:</b> {order.Notes}</p>
                            </div>

                            <h3>Chi tiết đơn hàng</h3>

                            <table style='width:100%;border-collapse:collapse;border:1px solid #eee'>
                                <thead>
                                    <tr style='background:#f5f5f5'>
                                        <th style='padding:10px;text-align:left'>Sản phẩm</th>
                                        <th style='padding:10px;text-align:center'>Số lượng</th>
                                        <th style='padding:10px;text-align:right'>Đơn giá</th>
                                        <th style='padding:10px;text-align:right'>Thành tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {itemRows}
                                </tbody>
                            </table>

                            <h3 style='text-align:right;color:#b45309'>
                                Tổng tiền: {FormatMoney(totalAmount)} đ
                            </h3>

                            <p>Chúng tôi sẽ xử lý và chuẩn bị đơn hàng của bạn trong thời gian sớm nhất.</p>
                            <p style='color:#666'>Luxury Jewelry xin cảm ơn quý khách 💎</p>
                        </div>
                    ";

                    _emailService.Send(
                        customer.Email,
                        $"Xác nhận đơn hàng #{order.Id} - Luxury Jewelry",
                        emailBody
                    );
                }
                catch (Exception mailEx)
                {
                    Console.WriteLine("Send order email error: " + mailEx.Message);
                }

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
                .ThenInclude(d => d.Product)
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
                    ProductName = d.Product != null ? d.Product.Name : "",
                    d.Quantity,
                    d.UnitPrice
                })
            });
        }

        [HttpGet("customer/{customerId}")]
        public IActionResult GetOrdersByCustomer(int customerId)
        {
            var orders = _context.Orders
                .Include(o => o.OrderDetails)
                .ThenInclude(d => d.Product)
                .Where(o => o.CustomerId == customerId)
                .OrderByDescending(o => o.Id)
                .Select(o => new
                {
                    id = o.Id,
                    orderDate = o.OrderDate,
                    status = o.Status,
                    notes = o.Notes,
                    totalAmount = o.OrderDetails.Sum(d => d.Quantity * d.UnitPrice),
                    details = o.OrderDetails.Select(d => new
                    {
                        productId = d.ProductId,
                        productName = d.Product != null ? d.Product.Name : "",
                        quantity = d.Quantity,
                        unitPrice = d.UnitPrice
                    })
                })
                .ToList();

            return Ok(orders);
        }

        private string FormatMoney(decimal value)
        {
            return value.ToString("N0", new CultureInfo("vi-VN"));
        }

        private class OrderEmailItem
        {
            public string ProductName { get; set; }

            public int Quantity { get; set; }

            public decimal UnitPrice { get; set; }

            public decimal Amount { get; set; }
        }
    }
}