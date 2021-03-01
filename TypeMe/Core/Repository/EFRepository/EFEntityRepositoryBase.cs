using Core.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Core.Repository.EFRepository
{
    public class EFEntityRepositoryBase<TEntity, IContext> : IEntityRepository<TEntity>
        where TEntity : class, IEntity, new()
        where IContext : DbContext, new()
    {
      
        public async Task<TEntity> GetAsync(Expression<Func<TEntity, bool>> filter = null)
        {
            using (var context = new IContext())
            {
                return filter == null
                    ? await context.Set<TEntity>().FirstOrDefaultAsync()
                    : await context.Set<TEntity>().Where(filter).FirstOrDefaultAsync();
            };
        }
      
        public async Task<List<TEntity>> GetAllAsync(Expression<Func<TEntity, bool>> filter = null)
        {
            using (var context = new IContext())
            {
                return filter == null
                    ? await context.Set<TEntity>().ToListAsync()
                    : await context.Set<TEntity>().Where(filter).ToListAsync();
            };
        }
        public async Task AddAsync(TEntity entity)
        {
            using (var context = new IContext())
            {
                var addEntity = context.Entry(entity);
                addEntity.State = EntityState.Added;
                await context.SaveChangesAsync();
            };
        }

        public async Task DeleteAsync(TEntity entity)
        {
            using (var context = new IContext())
            {
                var deleteEntity = context.Entry(entity);
                deleteEntity.State = EntityState.Deleted;
                await context.SaveChangesAsync();

            };
        }



        public async Task UpdateAsync(TEntity entity)
        {
            using (var context = new IContext())
            {
                var updateEntity = context.Entry(entity);
                updateEntity.State = EntityState.Modified;
                await context.SaveChangesAsync();

            };
        }

    }
}
