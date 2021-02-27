using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Abstract
{
    public interface IStatusService
    {
        Status GetStaWithId(int id);
        List<Status> GetStatuses();
        void Add(Status status);
        void Update(Status student);
        void Delete(int id);
    }
}
