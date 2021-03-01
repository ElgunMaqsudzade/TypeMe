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

        public void Add(string from, string to,int statusId)
        {
            Friend friend = new Friend
            {
                FromUserName = from,
                ToUserName = to,
                StatusId=statusId
            };
            _friendDal.Add(friend);
        }

        public void Delete(string from, string to)
        {
            if (_friendDal.Get(s => s.FromUserName == from && s.ToUserName == to) != null)
            {
                _friendDal.Delete(_friendDal.Get(s => s.FromUserName == from && s.ToUserName == to));
            }
            else if (_friendDal.Get(s => s.ToUserName == from && s.FromUserName == to) != null)
            {
                _friendDal.Delete(_friendDal.Get(s => s.ToUserName == from && s.FromUserName == to));
            }

        }

    }
}
