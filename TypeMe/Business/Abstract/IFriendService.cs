using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Abstract
{
    public interface IFriendService
    {
        Friend GetStaWithId(int id);
        List<Friend> GetStatuses();
        void Add(Friend friend);
        void Update(Friend friend);
        void Delete(int id);
    }
}
