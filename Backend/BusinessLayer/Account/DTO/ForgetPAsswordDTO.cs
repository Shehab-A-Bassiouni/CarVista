using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Account.DTO
{
    public class ForgetPAsswordDTO
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; }
    }
}
