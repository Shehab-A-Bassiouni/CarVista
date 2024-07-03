using AutoMapper;
using BusinessLayer.WishlistItem.DTO;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System.Text;
using System.Threading.Tasks;
using BusinessLayer.BookingServices.DTO;
using Microsoft.EntityFrameworkCore;

namespace BusinessLayer.BookingServices.Service
{
    public class BookingService : IBookingService
    {
        private readonly IRepository<Booking> _bookingRepository;
        private readonly IMapper _mapper;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public BookingService(IRepository<Booking> bookingRepository, IMapper mapper, IHttpContextAccessor httpContextAccessor)
        {
            _bookingRepository = bookingRepository;
            _mapper = mapper;
            _httpContextAccessor = httpContextAccessor;
        }
        public async Task<Booking> CreateBooking(CreateBookingDTO bookingDto)
        {
            var booking = _mapper.Map<Booking>(bookingDto);
            booking.Date = DateTime.Now;
            booking.BookNum = Guid.NewGuid().ToString();
            booking.isActive = true;
            booking.State = BookingState.Pending;
            var createdBooking = await _bookingRepository.Insert(booking);
            return createdBooking;
        }

        public async Task CancelBooking(int bookingId)
        {
            await ChangeBookingStatus(bookingId, BookingState.Cancelled);
        }

        public async Task CompletedBooking(int bookingId)
        {
            await ChangeBookingStatus(bookingId, BookingState.Completed);
        }

        public async Task DeliveredBooking(int bookingId)
        {
            await ChangeBookingStatus(bookingId, BookingState.Delivered);
        }

        public async Task<IEnumerable<DisplayBookingDTO>> GetAllBooking()
        {
            var bookings = await _bookingRepository.GetAll();
            return _mapper.Map<IEnumerable<Booking>, IEnumerable<DisplayBookingDTO>>(bookings);
        }




        public async Task ChangeBookingStatus(int bookingId, BookingState Status)
        {
            var Booking = await _bookingRepository.GetById(bookingId);
            if (Booking == null)
            {
                throw new InvalidOperationException("Booking not found");
            }

            Booking.State = Status;
            await _bookingRepository.Update(Booking);
        }

        public async Task<Booking> GetBookingById(int id)
        {
            return await _bookingRepository.GetById(id);
        }



        public async Task<IEnumerable<CompletedBookingsDTO>> GetBookingsForCurrentUser(int id)
        {
            if (id == null)
            {
                throw new InvalidOperationException("Invalid user ID");
            }

            var bookings = await _bookingRepository.GetWithIncludes(b => b.CustomerId == id, b => b.Car);
            ;

            return _mapper.Map<IEnumerable<CompletedBookingsDTO>>(bookings);
        }


        public async Task<Booking> GetBookingWithCustomerAndCar(int bookingId)
        {
            var bookings = await _bookingRepository.GetWithIncludes(
                b => b.Id == bookingId,
                b => b.Customer,
                b => b.Car
            );

            return bookings.FirstOrDefault();
        }
    }
}
