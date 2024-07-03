using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class Complaint
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public string ComplaintText { get; set; }
        public string State { get; set; }
        public bool isActive { get; set; }

        public int CustomerId { get; set; }
        public virtual Customer Customer { get; set; }
    }
}
