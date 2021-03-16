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
    public class CommentManager : ICommentService
    {
        private readonly ICommentDal _com;
        public CommentManager(ICommentDal com)
        {
            _com = com;
        }
        public async Task<List<Comment>> GetComments(int postId)
        {
            return await _com.GetAllAsync(c => c.PostId == postId&&c.ParentId==null);
        }
        public async Task<List<Comment>> GetAllComments(int postId)
        {
            return await _com.GetAllAsync(c => c.PostId == postId );
        }
        public async Task<int> GetAllCommentsCount(int postId)
        {
            return (await _com.GetAllAsync(c => c.PostId == postId)).Count();
        }
        public async Task<List<Comment>> GetChildComments(int commentId)
        {
            return await _com.GetAllAsync(c => c.ParentId == commentId);
        }
        public async Task<Comment> GetWithIdAsync(int id)
        {
            return await _com.GetAsync(c => c.Id == id);
        }
        public async Task Add(Comment comment)
        {
           await _com.AddAsync(comment);
        }

        public async Task Delete(int id)
        {
            await _com.DeleteAsync(new Comment { Id=id});
        }
        public async Task Update(Comment comment)
        {
            await _com.UpdateAsync(comment);
        }

        
    }
}
