using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.Service
{
    public interface IWishlistService
    {
        Task<List<DataLayer.Entities.WishlistItem>> GetAll(int userId);
        Task<List<DataLayer.Entities.WishlistItem>> GetForAllUsers();

        Task<List<DataLayer.Entities.WishlistItem>> GetAll(int pagenumber, int pagesize);

        Task<DataLayer.Entities.WishlistItem?> GetById(int id);
    }
}
