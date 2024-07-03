using AutoMapper;
using BusinessLayer.BookingServices.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.BookingServices.Mapper
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateBookingDTO, Booking>()
                 .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
                 .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo))
                 .ForMember(dest => dest.PaymentType, opt => opt.MapFrom(src => src.PaymentType))
                 .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                 .ForMember(dest => dest.CarId, opt => opt.MapFrom(src => src.CarId));


            CreateMap<Booking, DisplayBookingDTO>()
                 .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
                 .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo))
                 .ForMember(dest => dest.PaymentType, opt => opt.MapFrom(src => src.PaymentType))
                 .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                 .ForMember(dest => dest.CarId, opt => opt.MapFrom(src => src.CarId))
                 .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State.ToString()))
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));


            CreateMap<Booking, CompletedBookingsDTO>()
                 .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
                 .ForMember(dest => dest.BookNum, opt => opt.MapFrom(src => src.BookNum))
                 .ForMember(dest => dest.Date, opt => opt.MapFrom(src => src.Date))
                 .ForMember(dest => dest.DateFrom, opt => opt.MapFrom(src => src.DateFrom))
                 .ForMember(dest => dest.DateTo, opt => opt.MapFrom(src => src.DateTo))
                 .ForMember(dest => dest.State, opt => opt.MapFrom(src => src.State.ToString()))
                 .ForMember(dest => dest.PaymentType, opt => opt.MapFrom(src => src.PaymentType))
                 .ForMember(dest => dest.CustomerId, opt => opt.MapFrom(src => src.CustomerId))
                 .ForMember(dest => dest.CarId, opt => opt.MapFrom(src => src.CarId))
                 .ForMember(dest => dest.CarModel, opt => opt.MapFrom(src => src.Car.Model))
                 .ForMember(dest => dest.CarPlateNumber, opt => opt.MapFrom(src => src.Car.PlateNumber))
                 .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Car.Image))
                 .ForMember(dest => dest.YearModel, opt => opt.MapFrom(src => src.Car.YearModel));
        }
    }
}
