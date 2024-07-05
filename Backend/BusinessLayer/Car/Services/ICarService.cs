using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Car.Services
{
    public interface ICarService
    {
        Task<List<DataLayer.Entities.Car>> GetAll();

        Task<List<DataLayer.Entities.Car>> Get();
        Task<List<DataLayer.Entities.Car>> GetAll(int pagenumber, int pagesize);

        Task<DataLayer.Entities.Car?> GetById(int id);
    }
}
