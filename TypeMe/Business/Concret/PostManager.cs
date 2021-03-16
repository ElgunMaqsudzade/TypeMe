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
    public class PostManager : IPostService
    {
        private readonly IPostDal _post;
        public PostManager(IPostDal post)
        {
            _post = post;
        }

        public async Task<List<Post>> GetNewsAsync(string username, int skip, int take)
        {
            var posts = new List<Post>();
            return await _post.PaginateAsync(c=>c.Username== username, skip,take);
        }
        public async Task<List<Post>> GetPosts(string username)
        {
            return await _post.GetAllAsync(p=>p.Username==username);
        }
        public async Task<List<Post>> GetPostsForSkipAndTake(string username,int skip,int take)
        {
            return await _post.GetAllAsync(p => p.Username == username);
        }

        public async Task<Post> GetWithIdAsync(int id)
        {
            return await _post.GetAsync(p => p.Id == id);
        }
        public async Task Add(Post Post)
        {
            await _post.AddAsync(Post);
        }

        public async Task Delete(int id)
        {
            await _post.DeleteAsync( new Post { Id=id});
        }

      

        public async Task Update(Post Post)
        {
            await _post.UpdateAsync(Post);
        }

    }
}
