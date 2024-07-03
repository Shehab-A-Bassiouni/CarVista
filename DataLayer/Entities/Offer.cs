using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Offer
    {
        public int Id { get; set; }
        public string Type { get; set; }
        public double Percent { get; set; }
        public DateTime Expiration { get; set; }

        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool isAvailable { get; set; }
        public string Description { get; set; }
        public bool isActive { get; set; }

        public double Amount { get; set; }
    }
}
