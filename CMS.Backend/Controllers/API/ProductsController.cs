/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: API quản lý và tìm kiếm sản phẩm
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
                .Where(x => x.StockQuantity > 0)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(products);
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var product = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
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
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
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
                .Where(x => x.StockQuantity > 0)
                .Where(p => p.CategoryProductId == categoryProductId)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
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
            var total = _context.Products
                .Where(x => x.StockQuantity > 0)
                .Count();

            var data = _context.Products
                .Include(p => p.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
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
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(new
            {
                total,
                data
            });
        }

        [HttpGet("search")]
        public IActionResult Search(string? keyword)
        {
            var query = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var key = keyword.Trim();
                var likeKey = $"%{key}%";

                query = query.Where(x =>
                    (x.Name != null && EF.Functions.Like(x.Name, likeKey)) ||
                    (x.Description != null && EF.Functions.Like(x.Description, likeKey)) ||
                    (x.CategoryProduct != null &&
                     x.CategoryProduct.Name != null &&
                     EF.Functions.Like(x.CategoryProduct.Name, likeKey))
                );
            }

            var data = query
                .OrderByDescending(x => x.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.SoldQuantity,
                    p.StockQuantity,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(data);
        }

        [HttpGet("latest")]
        public IActionResult GetLatest()
        {
            var data = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
                .OrderByDescending(x => x.Id)
                .Take(3)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(data);
        }

        [HttpGet("hot")]
        public IActionResult GetHotProducts()
        {
            var data = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
                .OrderByDescending(x => x.SoldQuantity)
                .Take(3)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.StockQuantity,
                    p.SoldQuantity,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(data);
        }

        [HttpGet("shop")]
        public IActionResult Shop(
            int page = 1,
            int pageSize = 8,
            int? categoryId = null,
            string? sort = null,
            decimal? minPrice = null,
            decimal? maxPrice = null,
            string? keyword = null)
        {
            if (page < 1)
                page = 1;

            if (pageSize < 1)
                pageSize = 8;

            var query = _context.Products
                .Include(x => x.CategoryProduct)
                .Where(x => x.StockQuantity > 0)
                .AsQueryable();

            // ===== SEARCH KEYWORD =====
            if (!string.IsNullOrWhiteSpace(keyword))
            {
                var key = keyword.Trim();
                var likeKey = $"%{key}%";

                query = query.Where(x =>
                    (x.Name != null && EF.Functions.Like(x.Name, likeKey)) ||
                    (x.Description != null && EF.Functions.Like(x.Description, likeKey)) ||
                    (x.CategoryProduct != null &&
                     x.CategoryProduct.Name != null &&
                     EF.Functions.Like(x.CategoryProduct.Name, likeKey))
                );
            }

            // ===== FILTER CATEGORY =====
            if (categoryId.HasValue && categoryId.Value > 0)
            {
                query = query.Where(x => x.CategoryProductId == categoryId.Value);
            }

            // ===== FILTER PRICE =====
            if (minPrice.HasValue && minPrice.Value >= 0)
            {
                query = query.Where(x => x.Price >= minPrice.Value);
            }

            if (maxPrice.HasValue && maxPrice.Value > 0)
            {
                query = query.Where(x => x.Price <= maxPrice.Value);
            }

            // ===== SORT =====
            query = sort switch
            {
                "price_asc" => query.OrderBy(x => x.Price),
                "price_desc" => query.OrderByDescending(x => x.Price),
                "newest" => query.OrderByDescending(x => x.Id),
                "best" => query.OrderByDescending(x => x.SoldQuantity),
                _ => query.OrderByDescending(x => x.Id)
            };

            // ===== TOTAL =====
            var total = query.Count();

            // ===== PAGING =====
            var data = query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Name,
                    p.Price,
                    p.ImageUrl,
                    p.SoldQuantity,
                    p.StockQuantity,
                    p.CategoryProductId,
                    CategoryName = p.CategoryProduct != null ? p.CategoryProduct.Name : ""
                })
                .ToList();

            return Ok(new
            {
                total,
                data
            });
        }
    }
}