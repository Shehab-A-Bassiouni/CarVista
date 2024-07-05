using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Car
    {
        public int Id { get; set; }
        public string Model { get; set; }
        public string PlateNumber { get; set; }
        public string ChassisNumber { get; set; }
        public string Color { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public int YearModel { get; set; }
        public string FuelType { get; set; }
        public double PricePerDay { get; set; }
        public double Odometer { get; set; }
        public double FuelBar { get; set; }
        
        public int ManufacturerId { get; set; }
        public virtual Manufacturer Manufacturer { get; set; }



      

        public virtual ICollection<Booking> Bookings { get; set; }
        public virtual ICollection<Review> Reviews { get; set; }
        public virtual ICollection<WishlistItem> WishlistItems { get; set; }

        public bool isActive { get; set; }

    }

}
