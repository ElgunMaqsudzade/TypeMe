using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class StatusManager : IStatusService
    {
        private readonly IStatusDal _statusDal;
        public StatusManager(IStatusDal statusDal)
        {
            _statusDal = statusDal;
        }
        public async Task<List<Status>> GetStatuses()
        {
            return await _statusDal.GetAllAsync();
        }

        public async Task Add(Status status)
        {
            await _statusDal.AddAsync(status);
        }

        public async Task Delete(int id)
        {
            await _statusDal.DeleteAsync(new Status { Id = id });
        }
        public async Task Update(Status student)
        {
            await _statusDal.UpdateAsync(student);
        }

        public async Task<Status> GetStaWithIdAsync(int id)
        {
            return await  _statusDal.GetAsync(s => s.Id == id);
        }
    }
}
