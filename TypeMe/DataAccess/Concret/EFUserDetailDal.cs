using Core.Repository.EFRepository;
using DataAccess.Abstract;
using DataAccess.Abstract.Concret;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace DataAccess.Concret
{
    public class EFUserDetailDal : EFEntityRepositoryBase<UserDetail, AppDbContext>, IUserDetailDal
    {
        //private readonly AppDbContext _db;
        //public EFUserDetailDal(AppDbContext db)
        //{
        //    _db = db ?? throw new ArgumentNullException(nameof(db));
        //}

        //public async Task<UserDetail> GetDeatilWithLanguageAsync(string appuserId)
        //{
        //    return await _db.UserDetails
        //        .Include(b => b.UserLanguage).FirstOrDefaultAsync(d=>d.AppUserId==appuserId);
        //}
        //public EFImageDal(AppDbContext db)
        //{
        //    _db = db;
        //}
        //public List<Image> GetSkipAnd()
        //{
        //    return _db.ski.Ski(Function() pos).Take(Function() size);
        //}
    }
}
