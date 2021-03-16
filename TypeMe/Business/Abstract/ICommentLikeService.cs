using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface ICommentLikeService
    {
        Task<CommentIsLike> GetWithIdAsync(int commentId,string username);
        Task<List<CommentIsLike>> GetLikes(int commentId);
        Task<int> LikesCount(int commentId);
        Task Add(CommentIsLike comment);
        Task Update(CommentIsLike comment);
        Task Delete(int id);
    }
}
