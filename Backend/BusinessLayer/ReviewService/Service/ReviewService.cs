using BusinessLayer.BookingServices.Service;
using BusinessLayer.BookingServices.Service;
using DataLayer.Entities;
using DataLayer.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusinessLayer.ReviewService.Service
{
    public class ReviewService : IReviewService
    {
        private readonly IRepository<Review> _reviewRepository;
        private readonly IRepository<Booking> _BookingRepository;
        private readonly IBookingService _BookingService;
        public ReviewService(IRepository<Review> reviewRepository, IRepository<Booking> BookingRepository, IBookingService BookingService)
        {
            _reviewRepository = reviewRepository;
            _BookingRepository = BookingRepository;
            _BookingService = BookingService;
        }


        public async Task<Review> AddReview(int bookingId, string comment, int rate)
        {
            var booking = await _BookingRepository.GetById(bookingId);

            if (booking == null)
            {
                throw new InvalidOperationException("Booking not found");
            }

            Review review = new Review();


            review.Comment = comment;
            review.Rate = rate;
            review.CarId = booking.CarId;
            review.CustomerId = booking.CustomerId;
            review.Date = DateTime.Now;
            review.isActive = true;

            var addedReview = await _reviewRepository.Insert(review);
            return addedReview;
        }

        public async Task<IEnumerable<Review>> GetReviewsByCarId(int carId)
        {
            var reviews = await _reviewRepository.Get(r => r.CarId == carId);
            return reviews;
        }
    }
}
