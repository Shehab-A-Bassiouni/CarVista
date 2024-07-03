using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Entities
{
    public class User : IdentityUser<int>
    {
        [ForeignKey("MessagesSent")]
        public virtual ICollection<Message> SentMessages { get; set; }

        [ForeignKey("MessagesRecieved")]
        public virtual ICollection<Message> ReceivedMessages { get; set; }
        public virtual ICollection<Booking> Bookings { get; set; }
        public bool isActive { get; set; }

    }
}
