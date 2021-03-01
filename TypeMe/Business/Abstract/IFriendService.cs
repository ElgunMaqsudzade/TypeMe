using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Abstract
{
    public interface IFriendService
    {
        Friend GetFriendWithId(string whoseId,string whichId);
        List<Friend> GetFriends(string whoseId);
        void Add(string from,string to,int statusId);
        void Delete(string from, string to);
    }
}
