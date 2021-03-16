using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class PostImageManager : IPostImageService
    {
        private readonly IPostImageDal _postDal;
        public PostImageManager(IPostImageDal postDal)
        {
            _postDal = postDal;
        }
        public async Task<List<PostImage>> GetPostImages(int PostId)
        {
            return await  _postDal.GetAllAsync(p => p.PostId == PostId);
        }
        public async Task<List<PostImage>> GetPostImageswithImageId(int ImageId)
        {
            return await _postDal.GetAllAsync(p => p.ImageId == ImageId);
        }
        public async Task<PostImage> GetWithIdAsync(int id)
        {
            return await _postDal.GetAsync(p => p.Id == id);
        }
        public async Task Add(PostImage postImage)
        {
            await _postDal.AddAsync(postImage);
        }

        public async Task Delete(int id)
        {
            await _postDal.DeleteAsync(new PostImage { Id = id });
        }



        public async Task Update(PostImage postImage)
        {
            await _postDal.UpdateAsync(postImage);
        }
       
    }
}
