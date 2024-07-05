using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.BookingServices.DTO
{
    public class CompletedBookingsDTO
    {
        public int Id { get; set; }
        public string BookNum { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public string State { get; set; }
        public string PaymentType { get; set; }
        public int CustomerId { get; set; }
        public int CarId { get; set; }
        public string CarModel { get; set; }
        public string CarPlateNumber { get; set; }
        public string Image { get; set; }
        public int YearModel { get; set; }
    }
}
