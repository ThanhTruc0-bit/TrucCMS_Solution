using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin")]
    public class AdvertisementController : Controller
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ================= LIST =================
        public IActionResult Index()
        {
            var data = _context.Advertisements.ToList();
            return View(data);
        }

        // ================= CREATE GET =================
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // ================= CREATE POST =================
        [HttpPost]
        public IActionResult Create(Advertisement model, IFormFile uploadImage)
        {
            if (uploadImage != null)
            {
                model.ImageUrl = UploadFile(uploadImage);
            }

            _context.Advertisements.Add(model);
            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= EDIT GET =================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.Advertisements.Find(id);
            if (item == null) return NotFound();

            return View(item);
        }

        // ================= EDIT POST =================
        [HttpPost]
        public IActionResult Edit(Advertisement model, IFormFile uploadImage)
        {
            var item = _context.Advertisements.Find(model.Id);
            if (item == null) return NotFound();

            item.Title = model.Title;
            item.Description = model.Description;
            item.IsActive = model.IsActive;

            if (uploadImage != null)
            {
                item.ImageUrl = UploadFile(uploadImage);
            }

            _context.SaveChanges();

            return RedirectToAction("Index");
        }

        // ================= DELETE =================
        public IActionResult Delete(int id)
        {
            var item = _context.Advertisements.Find(id);

            if (item != null)
            {
                _context.Advertisements.Remove(item);
                _context.SaveChanges();
            }

            return RedirectToAction("Index");
        }

        // ================= UPLOAD FUNCTION =================
        private string UploadFile(IFormFile file)
        {
            string folder = Path.Combine(
                Directory.GetCurrentDirectory(),
                "wwwroot",
                "uploads"
            );

            if (!Directory.Exists(folder))
                Directory.CreateDirectory(folder);

            string fileName = Guid.NewGuid().ToString()
                + Path.GetExtension(file.FileName);

            string filePath = Path.Combine(folder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }

            return "/uploads/" + fileName; // 🔥 LUÔN CÓ /
        }
    }
}