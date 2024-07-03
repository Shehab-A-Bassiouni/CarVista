using BusinessLayer.BookingServices.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.BookingServices.Service
{
    public interface IBookingService
    {
        Task<IEnumerable<DisplayBookingDTO>> GetAllBooking();
        Task<Booking> CreateBooking(CreateBookingDTO bookingDto);
        Task<Booking> GetBookingById(int id);
        Task ChangeBookingStatus(int bookingId, BookingState Status);
        Task CancelBooking(int bookingId);
        Task CompletedBooking(int bookingId);
        Task<IEnumerable<CompletedBookingsDTO>> GetBookingsForCurrentUser(int id);

        Task<Booking> GetBookingWithCustomerAndCar(int bookingId);

    }
}