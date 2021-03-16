using Core.Entities;
using Core.Repository;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Abstract
{
    public interface IPostDal : IEntityRepository<Post>
    {
        Task<List<Post>> PaginateAsync(Expression<Func<Post, bool>> filter = null, int skip = 0, int take = 0);
    }
}
