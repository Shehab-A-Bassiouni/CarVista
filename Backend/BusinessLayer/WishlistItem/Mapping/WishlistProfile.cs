using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer.Entities;
using BusinessLayer.WishlistItem.DTO;
namespace BusinessLayer.WishlistItem.Mapping
{
    public class WishlistProfile : Profile
    {
        public WishlistProfile()
        {
            CreateMap<DataLayer.Entities.WishlistItem , WishListDTO>()
                .ForMember(Dest => Dest.Image, opt => opt.MapFrom(src => src.Car.Image))
                .ForMember(Dest => Dest.Model, opt => opt.MapFrom(src => src.Car.Model))
                .ForMember(Dest => Dest.CarId, opt => opt.MapFrom(src => src.CarId))
                .ForMember(Dest => Dest.Manufacturer, opt => opt.MapFrom(src => src.Car.Manufacturer.Name))
                .ForMember(Dest => Dest.isActive, opt => opt.MapFrom(src => src.isActive))
                .ForMember(Dest => Dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                .ForMember(Dest => Dest.Description, opt => opt.MapFrom(src => src.Car.Description));

            CreateMap<AddWishlishItemDTO , DataLayer.Entities.WishlistItem>();
        }
    }
}
