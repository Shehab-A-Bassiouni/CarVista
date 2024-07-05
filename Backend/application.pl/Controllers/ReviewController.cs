using BusinessLayer.ReviewService.Service;
using DataLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReviewController : ControllerBase
    {

        private readonly IReviewService _reviewService;

        public ReviewController(IReviewService reviewService)
        {
            _reviewService = reviewService;
        }

        [HttpPost]
        public async Task<ActionResult<Review>> AddReview(int bookingId, string comment, int rate)
        {
            try
            {
                var addedReview = await _reviewService.AddReview(bookingId, comment, rate);
                return Created();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("car/{carId}")]
        public async Task<ActionResult<IEnumerable<Review>>> GetReviewsByCarId(int carId)
        {
            var reviews = await _reviewService.GetReviewsByCarId(carId);
            return Ok(reviews);
        }
    }
}
