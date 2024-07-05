using AutoMapper;
using BusinessLayer.Car.DTO;
using BusinessLayer.Car.Services;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Mvc;
using Stripe;
using Stripe.Checkout;
using System.Collections.Generic;
using BusinessLayer.Car.DTO;
using BusinessLayer.Car.Services;
using BusinessLayer.OfferManagement.Services;

namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {
        private readonly ICarService CarService;
        private readonly IRepository<Car> CarRepo;
        private readonly IMapper mapper;
        private readonly OfferService offerService;
        public PaymentController(IRepository<Car> carRepo, IMapper mapper, ICarService carService, OfferService offerService)
        {
            CarRepo = carRepo;
            this.mapper = mapper;
            CarService = carService;
            StripeConfiguration.ApiKey = "sk_test_51OttOEBBRnVLSfz9FdXN9MRsddhx8RIUU5FBHS3N1aEEBtMoV4MTzUfzeuomzrIrLWNdIWBlbKDenFM9Ra7W8DyZ00gfBwJzGL";
            this.offerService = offerService;

        }
        [HttpGet()]
        public async Task<IActionResult> CreditCheckout([FromQuery] int carid, [FromQuery] int days)
        {
            var car = await CarService.GetById(carid);
            var carDto =  mapper.Map<CarManufacturerDTO>(car);

            var offer = await offerService.GetLastActiveOffer();
            long unitAmount = Convert.ToInt64(carDto.PricePerDay) * days * 100;

            if (offer != null && offer.isActive)
            {
                unitAmount = (long)(unitAmount * (1 - (offer.Percent / 100.0)));
            }

            var options = new SessionCreateOptions
            {
                PaymentMethodTypes = new List<string>
                {
                    "card",
                },
                LineItems = new List<SessionLineItemOptions>
                {
                    new SessionLineItemOptions
                    {


                        PriceData = new SessionLineItemPriceDataOptions
                        {

                            Currency = "egp",
                            UnitAmount = unitAmount,
                            //UnitAmount = (Convert.ToInt64( carDto.PricePerDay) *days)*100,
                            ProductData = new SessionLineItemPriceDataProductDataOptions
                            {
                                Name = carDto.Manufacturer+" " +carDto.Model+ " " +carDto.YearModel,
                                Description = carDto.Color,
                                Images = new List<string>(){ "https://myogs.s3.amazonaws.com/logo-blue.png"},
                            },
                        },
                        Quantity = 1,

                    },
                },
                Mode = "payment",
                SuccessUrl = "http://localhost:4200/Success",
                CancelUrl = "http://localhost:4200/Failed",
            };

            var service = new SessionService();
            Session session = service.Create(options);

            return Ok(new { sessionId = session.Id });
        }
    }
}
