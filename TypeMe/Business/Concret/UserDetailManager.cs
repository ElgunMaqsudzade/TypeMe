using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class UserDetailManager : IUserDetailService
    {
        private readonly IUserDetailDal _detailDal;
        public UserDetailManager(IUserDetailDal detailDal)
        {
            _detailDal = detailDal;
        }
        public async Task<List<UserDetail>> GetDetails()
        {
            return await _detailDal.GetAllAsync();
        }

        public async Task<UserDetail> GetWithIdAsync(string id)
        {
            return await _detailDal.GetAsync(d => d.AppUserId == id);
        }
        public async Task Add(UserDetail detail)
        {
            await _detailDal.AddAsync(detail);
        }

        public async Task Delete(string id)
        {
           await _detailDal.DeleteAsync(new UserDetail { AppUserId = id });
        }

       

        public async Task Update(UserDetail detail)
        {
            await _detailDal.UpdateAsync(detail);
        }

        public Task<List<UserDetail>> GetDeails()
        {
            throw new NotImplementedException();
        }
    }
}
