using BusinessLayer.BookingServices.DTO;
using BusinessLayer.BookingServices.Service;
using DataLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookingController : ControllerBase
    {
        private readonly IBookingService _bookingService;

        public BookingController(IBookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [HttpPost]
        public async Task<ActionResult<Booking>> CreateBooking(CreateBookingDTO bookingDto)
        {
            var createdBooking = await _bookingService.CreateBooking(bookingDto);
            return CreatedAtAction(nameof(GetBookingById), new { id = createdBooking.Id }, createdBooking);
        }



        [HttpPut("cancel/{bookingId}")]
        public async Task<IActionResult> CancelBooking(int bookingId)
        {
            await _bookingService.CancelBooking(bookingId);
            return NoContent();
        }

        [HttpPut("complete/{bookingId}")]
        public async Task<IActionResult> CompleteBooking(int bookingId)
        {
            await _bookingService.CompletedBooking(bookingId);
            return NoContent();
        }

        [HttpPut("deliver/{bookingId}")]
        public async Task<IActionResult> DeliverCar(int bookingId)
        {
            await _bookingService.CompletedBooking(bookingId);
            return NoContent();
        }

        [HttpPut("UpdateBookingState/{bookingId}")]
        public async Task<IActionResult> UpdateBookingState(int bookingId, BookingState status)
        {
            try
            {
                await _bookingService.ChangeBookingStatus(bookingId, status);
                return NoContent();
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = ex.Message });
            }
        }



        [HttpGet]
        public async Task<ActionResult<IEnumerable<Booking>>> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBooking();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Booking>> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingById(id);
            if (booking == null)
            {
                return NotFound();
            }
            return Ok(booking);
        }

        [HttpGet("userbookings/{userId}")]
        public async Task<ActionResult<IEnumerable<CompletedBookingsDTO>>> GetBookingsForCurrentUser(int userId)
        {
            var bookings = await _bookingService.GetBookingsForCurrentUser(userId);
            return Ok(bookings);
        }

    }
}
