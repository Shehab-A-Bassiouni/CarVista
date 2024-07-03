using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.OfferManagement.Services
{
   
    public class OfferService : IOfferService
    {
        private readonly IRepository<Offer> _offerRepository;
        private readonly CarvistaDbContext db;

        public OfferService(IRepository<Offer> offerRepository, CarvistaDbContext _db)
        {
            _offerRepository = offerRepository;
            db = _db;
        }

        public async Task<IEnumerable<Offer>> GetAllOffers()
        {
            return await db.Offers.Where(O => O.isActive == true).ToListAsync();
        }

        public async Task<IEnumerable<Offer>> GetAllAvailableOffer()
        {
            return await db.Offers.Where(O => O.isActive == true && O.isAvailable == true).ToListAsync();
        }

        public async Task<Offer> GetOfferById(int id)
        {
            return await db.Offers.Where(o=>o.Id == id && o.isActive==true).FirstOrDefaultAsync();
        }

        public async Task<Offer> AddOffer(Offer offer)
        {
            return await _offerRepository.Insert(offer);
        }

        public async Task<Offer> UpdateOffer(Offer offer)
        {

            var existingOffer = await _offerRepository.GetById(offer.Id);
            if (existingOffer == null)
            {
                throw new InvalidOperationException("Offer not found");
            }

            _offerRepository.Detach(existingOffer);
            return await _offerRepository.Update(offer);
        }

        public async Task DeleteOffer(int id)
        {
            var offer = await _offerRepository.GetById(id);
            if (offer is not null)
            {
                offer.isAvailable = false;
            }
            else
            {
                throw new InvalidOperationException("Offer not found");
            }

            await _offerRepository.Delete(offer);
        }
        public async Task<Offer> GetLastActiveOffer()
        {
            var lastActiveOffer =(await _offerRepository.GetAll()).LastOrDefault(o => o.isAvailable == true && o.isActive==true);
            return lastActiveOffer;
        }


        public async Task<bool> IsExist(int id)
        {
            var IsOfferExist = (await _offerRepository.GetAll()).Any(x => x.Id == id);
            return IsOfferExist;
        }

    }
}
