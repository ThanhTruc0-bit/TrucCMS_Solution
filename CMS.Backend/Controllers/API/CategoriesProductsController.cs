/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Thực thể danh mục 
 */
using Microsoft.AspNetCore.Mvc;
using CMS.Data;
using System.Linq;

namespace CMS.Backend.Controllers.API
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesProductsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public CategoriesProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/CategoriesProducts
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.CategoriesProducts.Select(x => new {
                x.Id,
                x.Name,
                x.Description,
                x.ImageUrl
            }).ToList();

            return Ok(data);
        }
    }
}