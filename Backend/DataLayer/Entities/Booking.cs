using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Booking
    {
        public int Id { get; set; }
        public string BookNum { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
        public BookingState State { get; set; }
        public string PaymentType { get; set; }
        public bool isActive { get; set; }
        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
        public int CarId { get; set; }
        public virtual Car Car { get; set; }
    }
    public enum BookingState
    {
        Pending,
        Cancelled,
        Delivered,
        Completed
    }
}