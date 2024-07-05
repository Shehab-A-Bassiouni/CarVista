using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Account.DTO
{
    public class EditPRofileDTO
    {
        public int Id { get; set; }
        //public string Signature { get; set; }
        [EmailValidation]

        public string Email { get; set; }
        public DateTime Dob { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public string Phone { get; set; }
        public string Image { get; set; }
        public string Identity { get; set; }
        public DateTime LicenseExpiration { get; set; }
        public string DrivingLicense { get; set; }

    }
}
