using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Concret
{
    public class StatusManager : IStatusService
    {
        private readonly IStatusDal _statusDal;
        public StatusManager(IStatusDal statusDal)
        {
            _statusDal = statusDal;
        }
        public List<Status> GetStatuses()
        {
            return _statusDal.GetAll();
        }

        public Status GetStaWithId(int id)
        {
            return _statusDal.Get(s => s.Id == id);
        }
        public void Add(Status status)
        {
            _statusDal.Add(status);
        }

        public void Delete(int id)
        {
            _statusDal.Delete(new Status { Id = id });
        }
        public void Update(Status student)
        {
            _statusDal.Update(student);
        }
    }
}
