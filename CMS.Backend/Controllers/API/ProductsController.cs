/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using CMS.Data.Entities;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.Id == id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.Description,
                    p.StockQuantity,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .FirstOrDefault();

            if (product == null)
                return NotFound();

            return Ok(product);
        }

        [HttpGet("category/{categoryProductId}")]
        public IActionResult GetByCategory(int categoryProductId)
        {
            var products = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToList();

            return Ok(products);
        }

        [HttpPost]
        public IActionResult Create(Product model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            _context.Products.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, Product model)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            product.Name = model.Name;
            product.Price = model.Price;
            product.Description = model.Description;
            product.StockQuantity = model.StockQuantity;

            // FIX AN TOÀN: tránh null overwrite
            product.ImageUrl = model.ImageUrl ?? product.ImageUrl;

            product.CategoryProductId = model.CategoryProductId;

            _context.SaveChanges();

            return Ok(product);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var product = _context.Products.FirstOrDefault(p => p.Id == id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            _context.SaveChanges();

            return Ok(new { message = "Deleted successfully" });
        }

        [HttpGet("paging")]
        public IActionResult GetPaging(int page = 1, int pageSize = 10)
        {
            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    CategoryName = p.CategoryProduct.Name
                })
                .ToList();

            return Ok(data);
        }
    }
}