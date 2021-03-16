using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IPostImageService
    {
        Task<PostImage> GetWithIdAsync(int imageId);
        Task<List<PostImage>> GetPostImages(int postId);
        Task<List<PostImage>> GetPostImageswithImageId(int imageId);
        Task Add(PostImage postImage);
        Task Update(PostImage postImage);
        Task Delete(int id);
    }
}
