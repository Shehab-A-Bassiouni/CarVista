using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Complaints.DTO
{
    public class ComplaintDTO
    {
        public int Id { get; set; }

        public string ComplaintBody { get; set; }

        public string State { get; set; }

        public DateTime Date { get; set; } = DateTime.Now;

        public string? ClaimantFullName { get; set; } 

        public int CustomerId { get; set; }

    }
}
