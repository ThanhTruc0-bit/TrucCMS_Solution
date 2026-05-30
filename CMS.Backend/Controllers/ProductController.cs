/*
Họ Tên: Nguyễn Thị Thanh Trúc
MSSV: 2123110119
Lớp: CCQ2311D
Ngày tạo: 15/05/2026
Mô tả: Controller sản phẩm
*/

using CMS.Data;
using CMS.Data.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace CMS.Backend.Controllers
{
    [Authorize(Roles = "Admin,Editor")]
    public class ProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // =========================
        // DANH SÁCH SẢN PHẨM
        // =========================
        public IActionResult Index()
        {
            var products = _context.Products
                                   .Include(p => p.CategoryProduct)
                                   .OrderByDescending(p => p.Id)
                                   .ToList();

            return View(products);
        }

        // =========================
        // CHI TIẾT SẢN PHẨM
        // =========================
        public IActionResult Details(int id)
        {
            var product = _context.Products
                                  .Include(p => p.CategoryProduct)
                                  .FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // =========================
        // THÊM SẢN PHẨM - GET
        // =========================
        [HttpGet]
        public IActionResult Create()
        {
            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name"
            );

            return View();
        }

        // =========================
        // THÊM SẢN PHẨM - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product model, IFormFile? uploadImage)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CategoryList = new SelectList(
                    _context.CategoriesProducts,
                    "Id",
                    "Name"
                );

                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(uploadImage.FileName);

                string filePath =
                    Path.Combine(folder, fileName);

                using (var stream =
                    new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }

            _context.Products.Add(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // =========================
        // CHỈNH SỬA - GET
        // =========================
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var product = _context.Products.Find(id);

            if (product == null)
            {
                return NotFound();
            }

            ViewBag.CategoryList = new SelectList(
                _context.CategoriesProducts,
                "Id",
                "Name",
                product.CategoryProductId
            );

            return View(product);
        }

        // =========================
        // CHỈNH SỬA - POST
        // =========================
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product model, IFormFile? uploadImage)
        {
            if (!ModelState.IsValid)
            {
                ViewBag.CategoryList = new SelectList(
                    _context.CategoriesProducts,
                    "Id",
                    "Name",
                    model.CategoryProductId
                );

                return View(model);
            }

            if (uploadImage != null && uploadImage.Length > 0)
            {
                string folder = Path.Combine(
                    Directory.GetCurrentDirectory(),
                    "wwwroot",
                    "uploads"
                );

                if (!Directory.Exists(folder))
                {
                    Directory.CreateDirectory(folder);
                }

                string fileName =
                    Guid.NewGuid().ToString() +
                    Path.GetExtension(uploadImage.FileName);

                string filePath =
                    Path.Combine(folder, fileName);

                using (var stream =
                    new FileStream(filePath, FileMode.Create))
                {
                    uploadImage.CopyTo(stream);
                }

                model.ImageUrl = "/uploads/" + fileName;
            }
            else
            {
                var oldProduct = _context.Products
                    .AsNoTracking()
                    .FirstOrDefault(x => x.Id == model.Id);

                if (oldProduct != null)
                {
                    model.ImageUrl = oldProduct.ImageUrl;
                }
            }

            _context.Products.Update(model);
            _context.SaveChanges();

            return RedirectToAction(nameof(Index));
        }

        // =========================
        // XÓA SẢN PHẨM
        // =========================
        public IActionResult Delete(int id)
        {
            var product = _context.Products.Find(id);

            if (product != null)
            {
                _context.Products.Remove(product);
                _context.SaveChanges();
            }

            return RedirectToAction(nameof(Index));
        }
    }
}