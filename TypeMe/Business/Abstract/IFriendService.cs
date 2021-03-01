using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IFriendService
    {
        Task<Friend> GetFriendWithId(string whoseId,string whichId);
        Task<Friend> Get(string whoseId,string whichId);
        Task<List<Friend>> GetFriends(string whoseId);
        Task Add(Friend friend);
        Task Update(Friend friend,int statusId);
        Task Delete(Friend friend);
    }
}
