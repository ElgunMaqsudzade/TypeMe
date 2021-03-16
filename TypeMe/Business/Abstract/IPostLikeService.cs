using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IPostLikeService
    {
        Task<PostIsLike> GetWithIdAsync(int postId, string username);
        Task<List<PostIsLike>> GetLikes(int PostId);
        Task<int> LikesCount(int PostId);
        Task Add(PostIsLike Post);
        Task Update(PostIsLike Post);
        Task Delete(int id);
    }
}
