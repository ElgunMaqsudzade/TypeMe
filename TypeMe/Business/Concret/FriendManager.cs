using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Concret
{
    public class FriendManager : IFriendService
    {
        private readonly IFriendDal _friendDal;
        public FriendManager(IFriendDal friendDal)
        {
            _friendDal = friendDal;
        }
        public List<Friend> GetFriends(string whoseId)
        {
            //List<AppUser> appUsers = new List<AppUser>();
            return _friendDal.GetAll(s => s.FromUserName == whoseId||s.ToUserName==whoseId);

        }
        public Friend Get(string whoseId, string whichId)
        {
           return _friendDal.Get(s => s.FromUserName == whoseId && s.ToUserName == whichId);
        }

        public Friend GetFriendWithId(string whoseId, string whichId)
        {
            if(_friendDal.Get(s => s.FromUserName == whoseId && s.ToUserName == whichId) != null)
            {
                return _friendDal.Get(s => s.FromUserName == whoseId && s.ToUserName == whichId);
            }
            else  
            {
                return _friendDal.Get(s => s.ToUserName == whoseId && s.FromUserName == whichId);
            }
            
        }

        public void Add(Friend friend)
        {
            _friendDal.Add(friend);
        }

        public void Update(Friend friend,int statusId)
        {
            friend.StatusId = statusId;
            _friendDal.Update(friend);
        }
        

        

        public void Delete(Friend friend)
        {
            _friendDal.Delete(friend);
        }
    }
}
