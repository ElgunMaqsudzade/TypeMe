using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class PostLikeManager : IPostLikeService
    {
        private readonly IPostIsLikeDal _postLike;
        public PostLikeManager(IPostIsLikeDal postLike)
        {
            _postLike = postLike;
        }

        public async Task<List<PostIsLike>> GetLikes(int PostId)
        {
            return await _postLike.GetAllAsync(c => c.PostId == PostId);
        }
        public async Task<int> LikesCount(int PostId)
        {
            return (await _postLike.GetAllAsync(c => c.PostId == PostId)).Count();
        }

        public async Task<PostIsLike> GetWithIdAsync(int postId, string username)
        {
            return await _postLike.GetAsync(c => c.PostId == postId&& c.Username==username);
        }
        public async Task Add(PostIsLike like)
        {
            await _postLike.AddAsync(like);
        }

        public async Task Delete(int id)
        {
            await _postLike.DeleteAsync(new PostIsLike { Id = id });
        }


        public async Task Update(PostIsLike like)
        {
            await _postLike.UpdateAsync(like);
        }


    }
}
