using DataLayer.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DataLayer.Repository
{

    public class Repository<T> : IRepository<T> where T : class
    {
        private readonly CarvistaDbContext _context;

        public Repository(CarvistaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<T>> GetAll()
        {
            return await _context.Set<T>().ToListAsync();
        }

        public void Detach(T entity)
        {
            _context.Entry(entity).State = EntityState.Detached;
        }

        public async Task<IEnumerable<T>> GetAll(int pagenumber, int pagesize)
        {
            return await _context.Set<T>().Skip((pagenumber - 1) * pagesize).Take(pagesize).ToListAsync();
        }

        public async Task<IEnumerable<T>> Get(Expression<Func<T, bool>> filter)
        {
            return await _context.Set<T>().Where(filter).ToListAsync();
        }

        public async Task<T?> GetById(int id)
        {
            return await _context.Set<T>().FindAsync(id);
        }

        public async Task<T> Insert(T entity)
        {
            await _context.Set<T>().AddAsync(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task<T> Update(T entity)
        {
            _context.Set<T>().Update(entity);
            await _context.SaveChangesAsync();
            return entity;
        }

        public async Task Delete(T entity)
        {
            var entry = _context.Entry(entity);
            var isActiveProperty = entry.Property("isActive");

            if (isActiveProperty != null)
            {
                isActiveProperty.CurrentValue = false;
                await _context.SaveChangesAsync();
            }
            else
            {
                throw new InvalidOperationException("The entity does not have an 'isActive' property.");
            }
        }


        public async Task<IEnumerable<T>> GetWithIncludes(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes)
        {
            IQueryable<T> query = _context.Set<T>();

            foreach (var include in includes)
            {
                query = query.Include(include);
            }

            return await query.Where(filter).ToListAsync();
        }

    }

}
