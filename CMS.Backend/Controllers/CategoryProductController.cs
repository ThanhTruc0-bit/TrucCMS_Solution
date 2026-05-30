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

namespace CMS.Backend.Controllers
{
    public class CategoryProductController : Controller
    {
        private readonly ApplicationDbContext _context;

        public CategoryProductController(ApplicationDbContext context)
        {
            _context = context;
        }

        // Danh sách
        public IActionResult Index()
        {
            var data = _context.CategoriesProducts.ToList();
            return View(data);
        }

        // Chi tiết
        public IActionResult Details(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item == null)
                return NotFound();

            return View(item);
        }

        // Form thêm
        [HttpGet]
        public IActionResult Create()
        {
            return View();
        }

        // Lưu thêm
        [HttpPost]
        public IActionResult Create(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Add(model);
                _context.SaveChanges();

                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // Form sửa
        [HttpGet]
        public IActionResult Edit(int id)
        {
            var item = _context.CategoriesProducts.Find(id);

            if (item == null)
                return NotFound();

            return View(item);
        }

        // Lưu sửa
        [HttpPost]
        public IActionResult Edit(CategoryProduct model)
        {
            if (ModelState.IsValid)
            {
                _context.CategoriesProducts.Update(model);
                _context.SaveChanges();

                return RedirectToAction(nameof(Index));
            }

            return View(model);
        }

        // Xóa
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