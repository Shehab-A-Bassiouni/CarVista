using AutoMapper;
using BusinessLayer.Car.DTO;
using BusinessLayer.OfferService.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.OfferService.Mapping
{
    public class OfferMapper : Profile
    {
        //CreateMap<DataLayer.Entities.Car, CarManufacturerDTO>().ForMember(Dest =>Dest.Manufacturer , opt =>opt.MapFrom(src => src.Manufacturer.Name));

        public OfferMapper()
        {
            CreateMap<Offer, OfferDTO>();
        }
    }
}
