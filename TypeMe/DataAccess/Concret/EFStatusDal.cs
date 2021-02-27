using Core.Repository.EFRepository;
using DataAccess.Abstract;
using DataAccess.Abstract.Concret;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Concret
{
    public class EFStatusDal : EFEntityRepositoryBase<Status, AppDbContext>, IStatusDal
    {
    }
}
