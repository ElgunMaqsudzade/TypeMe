using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class FriendManager : IFriendService
    {
        private readonly IFriendDal _friendDal;
        public FriendManager(IFriendDal friendDal)
        {
            _friendDal = friendDal;
        }
        public async Task<List<Friend>> GetFriends(string whoseId)
        {
            //List<AppUser> appUsers = new List<AppUser>();
            return await _friendDal.GetAllAsync(s => s.FromUserName == whoseId||s.ToUserName==whoseId);

        }
        public async Task<Friend> Get(string whoseId, string whichId)
        {
           return await _friendDal.GetAsync(s => s.FromUserName == whoseId && s.ToUserName == whichId);
        }

        public async Task<Friend> GetFriendWithId(string whoseId, string whichId)
        {
            if(await _friendDal.GetAsync(s => s.FromUserName == whoseId && s.ToUserName == whichId) != null)
            {
                return await _friendDal.GetAsync(s => s.FromUserName == whoseId && s.ToUserName == whichId);
            }
            else  
            {
                return await _friendDal.GetAsync(s => s.ToUserName == whoseId && s.FromUserName == whichId);
            }
            
        }

        public async Task Add(Friend friend)
        {
            await _friendDal.AddAsync(friend);
        }

        public async Task Update(Friend friend,int statusId)
        {
            friend.StatusId = statusId;
            await _friendDal.UpdateAsync(friend);
        }
        

        

        public async Task Delete(Friend friend)
        {
            await _friendDal.DeleteAsync(friend);
        }
    }
}
