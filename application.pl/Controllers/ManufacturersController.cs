using BusinessLayer.Complaints.DTO;
using BusinessLayer.Complaints.Services;
using BusinessLayer.Manifacturers.DTO;
using BusinessLayer.Manifacturers.Services;
using DataLayer.Context;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManufacturersController : ControllerBase
    {
        private readonly ManfServices services;
        private readonly CarvistaDbContext db;

        public ManufacturersController(ManfServices _services, CarvistaDbContext db)
        {
            services = _services;
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ManufacturerDTO>>> GetManufaturers()
        {
            var manfs = await services.GetManufacturersAsync();
            if (manfs == null) return NotFound();
            return Ok(manfs);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ManufacturerDTO>> GetManufaturerById(int id)
        {
            var manf = await services.GetManfByIdAsync(id);
            if (manf == null) return NotFound();
            return Ok(manf);
        }

        [HttpPost]
        public async Task<ActionResult<ManufacturerDTO>> CreateManf(ManufacturerDTO manfDTO)
        {
            if (manfDTO == null) return BadRequest();
            if (ModelState.IsValid)
            {
                var createdManf = await services.CreateManfAsync(manfDTO);
                return CreatedAtAction(nameof(GetManufaturerById), new { id = createdManf.Id }, createdManf);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateManf(ManufacturerDTO manfDTO)
        {
            var updatedManf = await services.UpdateManfAsync(manfDTO);
            if (updatedManf == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteManf(int id)
        {
            await services.DeleteManfAsync(id);
            return NoContent();
        }

        [HttpPost("/api/Manufacturer/Upload")]
        public IActionResult Upload(IFormFile image)
        {
            if (image != null && image.Length > 0)
            {
                string wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;

                string filePath = Path.Combine(wwwRootPath, "uploads", uniqueFileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    image.CopyTo(stream);
                }

                return Ok(new { Message = "File uploaded successfully", FileName = uniqueFileName });
            }
            return BadRequest("Invalid image file.");
        }
    }
}
