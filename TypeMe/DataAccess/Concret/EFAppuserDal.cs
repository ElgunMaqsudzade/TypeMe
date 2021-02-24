using Core.Repository.EFRepository;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Concret
{
    public class EFAppUserDal :EFEntityRepositoryBase<AppUser, AppDbContext>, IAppUserDal
    {
    }
}
