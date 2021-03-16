using Core.Entities;
using Core.Repository.EFRepository;
using DataAccess.Abstract;
using DataAccess.Abstract.Concret;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Concret
{
    public class EFPostDal : EFEntityRepositoryBase<Post, AppDbContext>, IPostDal
    {
        
        public async Task<List<Post>> PaginateAsync(Expression<Func<Post, bool>> filter = null, int skip = 0, int take = 0)
        {
            using (var context = new AppDbContext())
            {
                return filter == null
                    ? await context.Set<Post>().Skip(skip).Take(take).ToListAsync()
                    : await context.Set<Post>().Where(filter).Skip(skip).Take(take).ToListAsync();
            };
        }

    }
}
