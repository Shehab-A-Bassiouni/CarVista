using BusinessLayer.Account.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Numerics;
using System.Security.Cryptography.Xml;
using System.Security.Principal;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace BusinessLayer.Account.Mapping
{
    public class UserMapper
    {
        public User maptoUser(EditPRofileDTO dto)
        {
            return new Customer()
            {
                Id = dto.Id,
                FirstName = dto.FirstName,
                LastName = dto.LastName,
                Email = dto.Email,
                //Signature = dto.Signature,
                Dob = dto.Dob,
                Address = dto.Address,
                Phone = dto.Phone,
                Image = dto.Image,
                Identity = dto.Identity,
                LicenseExpiration = dto.LicenseExpiration,
                DrivingLicense = dto.DrivingLicense,
            };
        }
    }
}
