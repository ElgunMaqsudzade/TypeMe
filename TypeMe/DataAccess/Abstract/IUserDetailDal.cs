using Core.Repository;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Abstract
{
    public interface IUserDetailDal : IEntityRepository<UserDetail>
    {
    }
}
