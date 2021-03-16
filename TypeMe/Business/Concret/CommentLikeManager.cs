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
    public class CommentLikeManager : ICommentLikeService
    {
        private readonly ICommentIsLikeDal _commentLike;
        public CommentLikeManager(ICommentIsLikeDal commentLike)
        {
            _commentLike = commentLike;
        }

        public async Task<List<CommentIsLike>> GetLikes(int commentId)
        {
            return await _commentLike.GetAllAsync(c => c.CommentId == commentId);
        }
        public async Task<int> LikesCount(int commentId)
        {
            return (await _commentLike.GetAllAsync(c => c.CommentId == commentId)).Count();
        }

        public async Task<CommentIsLike> GetWithIdAsync(int commentId,string username)
        {
            return await _commentLike.GetAsync(c => c.CommentId == commentId&&c.Username==username);
        }
        public async Task Add(CommentIsLike like)
        {
            await _commentLike.AddAsync(like);
        }

        public async Task Delete(int id)
        {
            await _commentLike.DeleteAsync(new CommentIsLike { Id=id});
        }


        public async Task Update(CommentIsLike like)
        {
            await _commentLike.UpdateAsync(like);
        }

        
    }
}
