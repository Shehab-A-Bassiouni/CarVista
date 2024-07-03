using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.OfferService.DTO
{
    public class OfferDTO
    {
        public int Id { get; set; }
        public decimal Percentage { get; set; }
        public DateTime Expiration { get; set; }
        public DateTime CreationDate { get; set; } = DateTime.Now;
        public bool isAvailable { get; set; }

    }
}
