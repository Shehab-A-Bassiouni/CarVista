using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Review
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string Comment { get; set; }
        public int Rate { get; set; }

        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }

        public int CarId { get; set; }
        public virtual Car Car { get; set; }
        public bool isActive { get; set; }

    }
}
