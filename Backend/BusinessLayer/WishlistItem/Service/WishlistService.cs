using DataLayer.Context;
using DataLayer.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.Service
{
    public class WishlistService : IWishlistService
    {
        private readonly CarvistaDbContext _context;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public WishlistService(CarvistaDbContext context, IHttpContextAccessor httpContextAccessor)
        {
            _context = context;
            _httpContextAccessor = httpContextAccessor;
        }

        public async Task<List<DataLayer.Entities.WishlistItem>> GetAll(int userId)
        {
            return await _context.WishlistItems.Where(i => i.CustomerId == userId).Where(i=>i.isActive==true).Include(i => i.Car).ToListAsync();
        }

        public async Task<List<DataLayer.Entities.WishlistItem>> GetAll(int pageNumber, int pageSize)
        {
            return await _context.WishlistItems
                .Where(i => i.isActive == true)
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Include(i => i.Car)
                .ToListAsync();
        }

        public async Task<DataLayer.Entities.WishlistItem?> GetById(int id)
        {
            return await _context.WishlistItems
                .Where(i => i.isActive == true && i.Id == id)
                .Include(i => i.Car)
                .FirstOrDefaultAsync();
        }

        public async Task<List<DataLayer.Entities.WishlistItem>> GetForAllUsers()
        {
            return await _context.WishlistItems.Where(i=>i.isActive==true).Include(i => i.Car).Include(i => i.Car.Manufacturer).ToListAsync();
        }
    }
}
