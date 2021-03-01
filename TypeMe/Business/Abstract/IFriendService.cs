using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Abstract
{
    public interface IFriendService
    {
        Friend GetFriendWithId(string whoseId,string whichId);
        Friend Get(string whoseId,string whichId);
        List<Friend> GetFriends(string whoseId);
        void Add(Friend friend);
        void Update(Friend friend,int statusId);
        void Delete(Friend friend);
    }
}
