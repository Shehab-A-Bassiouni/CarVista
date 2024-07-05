using BusinessLayer.Complaints.DTO;
using BusinessLayer.Complaints.Services;
using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComplaintsController : ControllerBase
    {
        private readonly ComplaintServices services;
        private readonly CarvistaDbContext db;

        public ComplaintsController(ComplaintServices _services,CarvistaDbContext db)
        {
           services = _services;
            this.db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ComplaintDTO>>> GetComplaints()
        {
            var complaints = await services.GetComplaintsAsync();
            if (complaints == null) return NotFound();
            return Ok(complaints);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ComplaintDTO>> GetComplaintById(int id)
        {
            var complaint = await services.GetComplaintByIdAsync(id);
            if (complaint == null) return NotFound();
            return Ok(complaint);
        }

        [HttpPost]
        public async Task<ActionResult<ComplaintDTO>> CreateComplaint(ComplaintDTO complaintDTO)
        {
            if (complaintDTO == null) return BadRequest();
            if (ModelState.IsValid)
            {
                var createdComplaint = await services.CreateCopmlaintAsync(complaintDTO);
                return CreatedAtAction(nameof(GetComplaintById), new { id = createdComplaint.Id }, createdComplaint);
            }
            return BadRequest(ModelState);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComplaint(ComplaintDTO complaintDTO)
        {
            var updatedComplaint = await services.UpdateComplaintAsync(complaintDTO);
            if (updatedComplaint == null)
            {
                return NotFound();
            }
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComplaint(int id)
        {
            await services.DeleteComplaintAsync(id);
            return NoContent();
        }

    }
}
