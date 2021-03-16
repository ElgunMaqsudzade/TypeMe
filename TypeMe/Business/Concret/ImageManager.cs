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
    public class ImageManager : IImageService
    {
        private readonly IImageDal _imageDal;
        public ImageManager(IImageDal imageDal)
        {
            _imageDal = imageDal;
        }
        public async Task<List<Image>> GetImages(int albomId)
        {
            return await _imageDal.GetAllAsync(i => i.AlbomId == albomId);
        }
        public async Task  DeleteImages(int albomId)
        {
            foreach (Image img in await _imageDal.GetAllAsync(i=>i.AlbomId==albomId))
            {
                await _imageDal.DeleteAsync(new Image { Id = img.Id });
            }
           
        }
        public async Task<Image> GetWithIdAsync(int id)
        {
            return await _imageDal.GetAsync(i => i.Id == id);
        }
        public async Task<Image> GetLastImageAsync(int albomId)
        {
            return (await _imageDal.GetAllAsync(i => i.AlbomId == albomId)).Last();
        }
        public async Task Add(Image image)
        {
            await _imageDal.AddAsync(image);
        }

        public async Task Delete(int id)
        {
            await _imageDal.DeleteAsync(new Image {Id=id });
        }

       

        public async Task Update(Image image)
        {
            await _imageDal.UpdateAsync(image);
        }

        public Task<Image> GetSkipLastImageAsync(int albomId, int skip, int lasttake)
        {
            throw new NotImplementedException();
        }
    }
}
