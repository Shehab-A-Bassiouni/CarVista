using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataLayer.Entities;


namespace BusinessLayer.OfferManagement.Services
{
    public interface IOfferService
    {
        Task<Offer> GetLastActiveOffer();

        Task<IEnumerable<Offer>> GetAllOffers();

        Task<IEnumerable<Offer>> GetAllAvailableOffer();

        Task<Offer> GetOfferById(int id);


        Task<Offer> AddOffer(Offer offer);

        Task<Offer> UpdateOffer(Offer offer);

        Task DeleteOffer(int id);

        Task<bool> IsExist(int id);

    }
}
