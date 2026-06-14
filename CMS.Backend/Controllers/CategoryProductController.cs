using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _env;

        public CategoryProductController(ApplicationDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;
        }

        // LIST
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // DETAILS
        public IActionResult Details(int id)
        {
            var item = _context.CategoriesProducts.Find(id);
            if (item == null) return NotFound();

            return View(item);
        }

        // CREATE GET
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // CREATE POST
        [HttpPost]
        public IActionResult Create(CategoryProduct model, IFormFile imageFile)
        {
            if (!ModelState.IsValid) return View(model);

            if (imageFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(imageFile.FileName);
                var folder = Path.Combine(_env.WebRootPath, "uploads/categories");
                Directory.CreateDirectory(folder);

                var filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/categories/" + fileName;
            }

            _context.CategoriesProducts.Add(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // EDIT GET
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.CategoriesProducts.Find(id);
            if (item == null) return NotFound();

            return View(item);
        }

        // EDIT POST
        [HttpPost]
        public IActionResult Edit(CategoryProduct model, IFormFile imageFile)
        {
            var item = _context.CategoriesProducts.Find(model.Id);
            if (item == null) return NotFound();

            if (!ModelState.IsValid) return View(model);

            item.Name = model.Name;
            item.Description = model.Description;

            if (imageFile != null)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(imageFile.FileName);
                var folder = Path.Combine(_env.WebRootPath, "uploads/categories");
                Directory.CreateDirectory(folder);

                var filePath = Path.Combine(folder, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    imageFile.CopyTo(stream);
                }

                item.ImageUrl = "/uploads/categories/" + fileName;
            }

            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // DELETE
        public IActionResult Delete(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item != null)
            {
                _context.CategoriesProducts.Remove(item);
                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}