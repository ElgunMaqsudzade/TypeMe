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
        Task<Friend> GetProfile(string whoseId,string whichId,int statusId);
        Task<bool> IsFriend(string whoseId,string whichId,int statusId);
        Task<List<Friend>> GetFriends(string whoseId);
        Task<List<Friend>> GetAllFriends(string whoseId,int statusId);
        Task<List<string>> GetAllFriendsUsername(string username, int statusId);
        Task Add(Friend friend);
        Task Update(Friend friend,int statusId);
        Task Delete(Friend friend);
    }
}
