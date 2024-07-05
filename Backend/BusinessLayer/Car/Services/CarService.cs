using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Drawing.Printing;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
namespace BusinessLayer.Car.Services
{
    public class CarService : ICarService
    {
        private readonly CarvistaDbContext _context;

        public CarService(CarvistaDbContext context)
        {
            _context = context;
        }
        public async Task<List<DataLayer.Entities.Car>> Get()
        {
            return await _context.Cars.Include(i => i.Manufacturer).ToListAsync();
        }
        public async Task<List<DataLayer.Entities.Car>> GetAll()
        {
            return await _context.Cars.Where(i => i.isActive == true).Include(i=>i.Manufacturer).ToListAsync();
        }

        public async Task<List<DataLayer.Entities.Car>> GetAll(int pagenumber, int pagesize)
        {
            return await _context.Cars.Where(i => i.isActive == true).Skip((pagenumber -1) * pagesize).Take(pagesize).Include(i => i.Manufacturer).ToListAsync();
        }

        public async Task<DataLayer.Entities.Car?> GetById(int id)
        {
            return await _context.Cars.Where(i => i.isActive == true && i.Id == id).Include(i=>i.Manufacturer).FirstOrDefaultAsync();
        }
    }
}
