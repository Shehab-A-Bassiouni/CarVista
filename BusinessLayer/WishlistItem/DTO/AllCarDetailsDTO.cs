﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.DTO
{
    public class AllCarDetailsDTO
    {
        public string PlateNumber { get; set; }
        public string ChassisNumber { get; set; }
        public string Color { get; set; }
        public int YearModel { get; set; }
        public string FuelType { get; set; }
        public decimal PricePerDay { get; set; }
        public decimal Odometer { get; set; }
        public decimal FuelBar { get; set; }
    }
}
