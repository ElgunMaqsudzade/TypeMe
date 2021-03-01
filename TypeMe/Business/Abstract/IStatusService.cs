using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IStatusService
    {
        Task<Status> GetStaWithIdAsync(int id);
        Task<List<Status>> GetStatuses();
        Task Add(Status status);
        Task Update(Status student);
        Task Delete(int id);
    }
}
