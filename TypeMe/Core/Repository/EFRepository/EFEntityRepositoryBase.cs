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
        public TEntity Get(Expression<Func<TEntity, bool>> filter = null)
        {
            using (var context = new IContext())
            {
                return filter == null
                    ? context.Set<TEntity>().FirstOrDefault()
                    : context.Set<TEntity>().Where(filter).FirstOrDefault();
            };
        }

        public List<TEntity> GetAll(Expression<Func<TEntity, bool>> filter = null)
        {
            using (var context = new IContext())
            {
                return filter == null
                    ? context.Set<TEntity>().ToList()
                    : context.Set<TEntity>().Where(filter).ToList();
            };
        }
        public void Add(TEntity entity)
        {
            using (var context = new IContext())
            {
                var addEntity = context.Entry(entity);
                addEntity.State = EntityState.Added;
                context.SaveChanges();
            };
        }

        public void Delete(TEntity entity)
        {
            using (var context = new IContext())
            {
                var deleteEntity = context.Entry(entity);
                deleteEntity.State = EntityState.Deleted;
                context.SaveChanges();

            };
        }



        public void Update(TEntity entity)
        {
            using (var context = new IContext())
            {
                var updateEntity = context.Entry(entity);
                updateEntity.State = EntityState.Modified;
                context.SaveChanges();

            };
        }

    }
}
