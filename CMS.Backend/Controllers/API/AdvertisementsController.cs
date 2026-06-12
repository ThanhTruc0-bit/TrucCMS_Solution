using CMS.Data;
using Microsoft.AspNetCore.Mvc;
using System.Linq;
using CMS.Data.Entities;

namespace CMS.Backend.Controllers.API
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdvertisementsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AdvertisementsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/Advertisements
        [HttpGet]
        public IActionResult GetAll()
        {
            var data = _context.Advertisements
                .Where(x => x.IsActive)
                .Select(x => new
                {
                    x.Id,
                    x.Title,
                    x.ImageUrl,
                    x.Description
                })
                .ToList();

            return Ok(data);
        }

        // POST: api/Advertisements
        [HttpPost]
        public IActionResult Create(Advertisement model)
        {
            _context.Advertisements.Add(model);
            _context.SaveChanges();

            return Ok(model);
        }
    }
}