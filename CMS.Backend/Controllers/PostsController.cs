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

namespace CMS.Backend.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PostsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // GET ALL
        // =========================
        [HttpGet]
        public IActionResult GetAll()
        {
            var posts = _context.Posts
                .OrderByDescending(p => p.Id)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.ImageUrl,
                    p.CategoryId,
                    CreatedAt = p.CreatedDate
                })
                .ToList();

            return Ok(posts);
        }

        // =========================
        // GET BY ID
        // =========================
        [HttpGet("{id}")]
        public IActionResult GetDetail(int id)
        {
            var post = _context.Posts
                .Include(p => p.Category)
                .FirstOrDefault(p => p.Id == id);

            if (post == null)
                return NotFound();

            return Ok(new
            {
                post.Id,
                post.Title,
                post.Content,
                post.ImageUrl,
                post.CategoryId,
                CategoryName = post.Category.Name,
                post.CreatedDate
            });
        }

        // =========================
        // POST
        // =========================
        [HttpPost]
        public IActionResult Create(Post model)
        {
            model.CreatedDate = DateTime.Now;

            _context.Posts.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }

        // =========================
        // PUT
        // =========================
        [HttpPut("{id}")]
        public IActionResult Update(int id, Post model)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
                return NotFound();

            post.Title = model.Title;
            post.Content = model.Content;
            post.ImageUrl = model.ImageUrl;
            post.CategoryId = model.CategoryId;

            _context.SaveChanges();

            return Ok(post);
        }

        // =========================
        // DELETE
        // =========================
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == id);

            if (post == null)
                return NotFound();

            _context.Posts.Remove(post);
            _context.SaveChanges();

            return Ok(new { message = "Deleted successfully" });
        }
        [HttpGet("paging")]
        public IActionResult GetPaging(int page = 1, int pageSize = 10)
        {
            var data = _context.Posts
                .OrderByDescending(p => p.Id)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(p => new
                {
                    p.Id,
                    p.Title,
                    p.Content, 
                    p.ImageUrl,
                    p.CategoryId,
                    p.CreatedDate
                })
                .ToList();

            return Ok(data);
        }
    }
}