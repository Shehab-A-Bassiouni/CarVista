using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.ReviewService.Service
{
    public interface IReviewService
    {
        Task<IEnumerable<Review>> GetReviewsByCarId(int carId);

        Task<Review> AddReview(int bookingId, string comment, int rate);
    }
}
