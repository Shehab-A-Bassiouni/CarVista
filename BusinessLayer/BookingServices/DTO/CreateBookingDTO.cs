using BusinessLayer.Validations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.BookingServices.DTO
{
    public class CreateBookingDTO
    {
        [Required]
        public DateTime DateFrom { get; set; }

        [Required]
        [DateRange("DateFrom")]
        public DateTime DateTo { get; set; }

        [Required]
        public string PaymentType { get; set; }

        [Required]
        public int CarId { get; set; }

        [Required]
        public int CustomerId { get; set; }
    }
}
