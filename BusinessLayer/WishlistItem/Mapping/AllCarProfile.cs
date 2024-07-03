using AutoMapper;
using BusinessLayer.WishlistItem.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.Mapping
{
    public class AllCarProfile : Profile
    {
        public AllCarProfile()
        {
            CreateMap<DataLayer.Entities.WishlistItem, AllCarDetailsDTO>()
              .ForMember(Dest => Dest.PlateNumber, opt => opt.MapFrom(src => src.Car.PlateNumber))
              .ForMember(Dest => Dest.ChassisNumber, opt => opt.MapFrom(src => src.Car.ChassisNumber))
              .ForMember(Dest => Dest.PricePerDay, opt => opt.MapFrom(src => src.Car.PricePerDay))
              .ForMember(Dest => Dest.Odometer, opt => opt.MapFrom(src => src.Car.Odometer))
              .ForMember(Dest => Dest.FuelBar, opt => opt.MapFrom(src => src.Car.FuelBar))
              .ForMember(Dest => Dest.FuelType, opt => opt.MapFrom(src => src.Car.FuelType))
              .ForMember(Dest => Dest.Color, opt => opt.MapFrom(src => src.Car.Color))
              .ForMember(Dest => Dest.YearModel, opt => opt.MapFrom(src => src.Car.YearModel));

            CreateMap<AddWishlishItemDTO, DataLayer.Entities.WishlistItem>();
        }
    }
}
