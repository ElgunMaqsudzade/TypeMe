using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IPostService
    {
        Task<Post> GetWithIdAsync(int id);
        Task<List<Post>> GetPosts(string Username);
        Task<List<Post>> GetPostsForSkipAndTake(string Username,int skip,int take);
        Task Add(Post Post);
        Task Update(Post Post);
        Task Delete(int id);
        Task<List<Post>> GetNewsAsync(string username,int skip,int take);
    }
}
