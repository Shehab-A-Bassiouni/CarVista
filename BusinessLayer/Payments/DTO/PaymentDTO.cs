using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Payments.DTO
{
    public class PaymentDTO
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public DateTime Date { get; set; } = DateTime.Now;
        public double Amount { get; set; }
        public int BookingId { get; set; }
    }
}
