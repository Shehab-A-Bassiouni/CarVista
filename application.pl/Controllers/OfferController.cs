using BusinessLayer.OfferManagement.Services;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer.OfferManagement;

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly IOfferService _offerService;

        public OfferController(IOfferService offerService)
        {
            _offerService = offerService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var offers = await _offerService.GetAllOffers();
            return Ok(offers);
        }

        [HttpGet("AvailableOffers")]
        public async Task<IActionResult> GetAllAvailableOffers()
        {
            var offers = await _offerService.GetAllAvailableOffer();
            return Ok(offers);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var offer = await _offerService.GetOfferById(id);
            if (offer == null)
            {
                return NotFound();
            }
            return Ok(offer);
        }

        [HttpGet("last-active")]
        public async Task<IActionResult> GetLastActive()
        {
            var offer = await _offerService.GetLastActiveOffer();
            if (offer == null)
            {
                return NotFound();
            }
            return Ok(offer);
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] Offer offer)
        {
            if (offer == null)
            {
                return BadRequest();
            }
            var createdOffer = await _offerService.AddOffer(offer);
            return CreatedAtAction(nameof(GetById), new { id = createdOffer.Id }, createdOffer);
        }

        [HttpPut]
        public async Task<IActionResult> Update(Offer offer)
        {
            try
            {
                var updatedOffer = await _offerService.UpdateOffer(offer);
                return Ok(updatedOffer);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                await _offerService.DeleteOffer(id);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}