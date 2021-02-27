using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
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

        public FriendManager()
        {
        }

        public List<Friend> GetStatuses()
        {
            return _friendDal.GetAll();
        }

        public Friend GetStaWithId(int id)
        {
            return _friendDal.Get(s => s.Id == id);
        }
        public void Add(Friend friend)
        {
            _friendDal.Add(friend);
        }

        public void Delete(int id)
        {
             _friendDal.Delete(new Friend { Id = id });
        }

        public void Update(Friend friend)
        {
            _friendDal.Update(friend);
        }
    }
}
