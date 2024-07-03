using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Payment
    {
        public int Id { get; set; }
        public bool isActive { get; set; }

        public string Type { get; set; }
        public DateTime Date { get; set; }
        public double Amount { get; set; }

        public int BookingId { get; set; }
        public virtual Booking Booking { get; set; }
    }
}
