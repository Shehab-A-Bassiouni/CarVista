using AutoMapper;
using AutoMapper.Configuration.Annotations;
using BusinessLayer.Car.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer.Entities;

namespace BusinessLayer.Car.Mapping
{
    public class CarProfile : Profile
    {
        public CarProfile()
        {
            CreateMap<DataLayer.Entities.Car, CarManufacturerDTO>().ForMember(Dest =>Dest.Manufacturer , opt =>opt.MapFrom(src => src.Manufacturer.Name));
            CreateMap< AddCarDTO, DataLayer.Entities.Car>();
            CreateMap<EditCarDTO, DataLayer.Entities.Car>();

        }

    }
}
