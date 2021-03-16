using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface ICommentService
    {
        Task<Comment> GetWithIdAsync(int id);
        Task<List<Comment>> GetComments(int postId);
        Task<List<Comment>> GetAllComments(int postId);
        Task<int> GetAllCommentsCount(int postId);
        Task<List<Comment>> GetChildComments(int commentId);
        Task Add(Comment comment);
        Task Update(Comment comment);
        Task Delete(int id);
    }
}
