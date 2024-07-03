using BusinessLayer.Complaints.DTO;
using BusinessLayer.Manifacturers.DTO;
using BusinessLayer.Manifacturers.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Manifacturers.Mapping
{
    public class ManufacturerMapper
    {
        public static ManufacturerDTO MapToDTO(Manufacturer manf)
        {
            if (manf != null)
            {
                return new ManufacturerDTO
                {
                    Id = manf.Id,
                    Logo = manf.Logo,
                    Description = manf.Description,
                    Name = manf.Name,
                    CarIds = manf.Cars.Select(C => C.Id).ToList()
                };
            }
            return null;
        }

        public static Manufacturer MapToEntity(ManufacturerDTO manfDTO)
        {
            if (manfDTO != null)
            {
                return new Manufacturer
                {
                    Id = manfDTO.Id,
                    Logo = manfDTO.Logo,
                    Description = manfDTO.Description,
                    Name = manfDTO.Name,
                    isActive = true
                };
            }
            return null;
        }
    }
}
