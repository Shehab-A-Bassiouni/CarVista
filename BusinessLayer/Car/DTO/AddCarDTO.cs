using Microsoft.VisualBasic;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Car.DTO
{
    public class AddCarDTO
    {
        [Required]
        [StringLength(100)]
        public string Model { get; set; }

        [Required]
        [StringLength(20)]
        public string PlateNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string ChassisNumber { get; set; }

        [Required]
        [StringLength(50)]
        public string Color { get; set; }

        [StringLength(1000)]
        public string Description { get; set; }

        [Required]
        
        public int YearModel { get; set; }

        [Required]
        
        public string FuelType { get; set; }

        [Required]
        [Range(0, 10000)] 
        public decimal PricePerDay { get; set; }
       
        public decimal Odometer { get; set; }

        public decimal FuelBar { get; set; }

        [StringLength(200)]
        public string Image { get; set; }

        [Required]
        public int ManufacturerId { get; set; }

        [Required]
        public bool isActive { get; set; }

    }
}

