using BusinessLayer.Complaints.DTO;
using BusinessLayer.Complaints.Mapping;
using BusinessLayer.Manifacturers.DTO;
using BusinessLayer.Manifacturers.Mapping;
using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Manifacturers.Services
{
    public class ManfServices
    {
        private readonly IRepository<Manufacturer> ManfRepo;
        private readonly CarvistaDbContext db;

        public ManfServices(IRepository<Manufacturer> ManfRepo, CarvistaDbContext db)
        {
            this.ManfRepo = ManfRepo;
            this.db = db;
        }

        public async Task<IEnumerable<ManufacturerDTO>> GetManufacturersAsync()
        {
            var manfs = await db.Manufacturers
                                      .Include(m => m.Cars)
                                      .ToListAsync();

            var ManfDTOs = new List<ManufacturerDTO>();

            foreach (var manf in manfs)
            {
                if(manf.isActive)
                    ManfDTOs.Add(ManufacturerMapper.MapToDTO(manf));
            }

            return ManfDTOs;
        }

        public async Task<ManufacturerDTO> GetManfByIdAsync(int id)
        {
            var manf = await ManfRepo.GetById(id);

            if(manf is not null)
            {
                if (manf.isActive)
                    return ManufacturerMapper.MapToDTO(manf);
            }

            return null;

        }


        public async Task<Manufacturer> CreateManfAsync(ManufacturerDTO manfDTO)
        {
            var manfEntity = ManufacturerMapper.MapToEntity(manfDTO);
            var insertedEntity = await ManfRepo.Insert(manfEntity);
            return insertedEntity;
        }

      


        public async Task<Manufacturer> UpdateManfAsync(ManufacturerDTO manfDTO)
        {
            var manfEntity = ManufacturerMapper.MapToEntity(manfDTO);
            var updatedEntity = await ManfRepo.Update(manfEntity);
            return updatedEntity;
        }

        public async Task DeleteManfAsync(int id)
        {
            var complaint = await ManfRepo.GetById(id);
            if (complaint != null)
            {
                await ManfRepo.Delete(complaint);
            }
        }
    }
}
