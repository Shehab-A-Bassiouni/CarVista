using AutoMapper;
using BusinessLayer.WishlistItem.DTO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.Mapping
{
    public class WishMiniListProfile : Profile
    {
        public WishMiniListProfile()
        {
            CreateMap<DataLayer.Entities.WishlistItem, _2PropWishListDTO>()
                .ForMember(Dest => Dest.CarId, opt => opt.MapFrom(src => src.CarId))
                .ForMember(Dest => Dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId));

            CreateMap<AddWishlishItemDTO, DataLayer.Entities.WishlistItem>();
        }
    }
}
