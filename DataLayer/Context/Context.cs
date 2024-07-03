using DataLayer.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Context
{
    public class CarvistaDbContext : IdentityDbContext<User, IdentityRole<int>, int>
    {
        public DbSet<Admin> Admins { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Message> Messages { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Car> Cars { get; set; }
        public DbSet<Manufacturer> Manufacturers { get; set; }
        public DbSet<Review> Reviews { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<WishlistItem> WishlistItems { get; set; }
        public DbSet<Offer> Offers { get; set; }
        public DbSet<Complaint> Complaints { get; set; }

        public CarvistaDbContext(DbContextOptions<CarvistaDbContext> options)
            : base(options) {
            
                }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);



            modelBuilder.Entity<Booking>()
            .Property(b => b.State)
            .HasConversion(
                v => v.ToString(),
                v => (BookingState)Enum.Parse(typeof(BookingState), v)
          );

        }


    }

}