﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Manufacturer
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Logo { get; set; }
        public string Description { get; set; }
        public bool isActive { get; set; }

        public virtual ICollection<Car> Cars { get; set; }
    }
}
