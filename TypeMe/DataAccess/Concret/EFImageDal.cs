using Core.Repository.EFRepository;
using DataAccess.Abstract;
using DataAccess.Abstract.Concret;
using Entity.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace DataAccess.Concret
{
    public class EFImageDal : EFEntityRepositoryBase<Image, AppDbContext>, IImageDal
    {
        //private readonly AppDbContext _db;
        //public EFImageDal(AppDbContext db)
        //{
        //    _db = db ?? throw new ArgumentNullException(nameof(db));
        //}

        //public Image Add(Buyer buyer)
        //{
        //    return _context.Buyers.Add(buyer).Entity;
        //}

        //public async Task<Image> FindAsync(string buyerIdentityGuid)
        //{
        //    var buyer = await _db.Images
        //        .Include(b => b.AlbomId)
        //        .Where(b => b. == buyerIdentityGuid)
        //        .SingleOrDefaultAsync();

        //    return buyer;
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
