using Core.Repository;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Abstract
{
    public interface IAppUserDal : IEntityRepository<AppUser>
    {
    }
}
