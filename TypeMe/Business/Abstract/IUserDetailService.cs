using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IUserDetailService
    {
        Task<UserDetail> GetWithIdAsync(string id);
        Task<List<UserDetail>> GetDetails();
        Task Add(UserDetail detail);
        Task Update(UserDetail detail);
        Task Delete(string id);
    }
}
