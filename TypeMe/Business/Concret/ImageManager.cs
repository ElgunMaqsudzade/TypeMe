using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
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
        public async Task<List<Image>> GetImages(string appUserId)
        {
            return await _imageDal.GetAllAsync(i => i.AppUserId == appUserId);
        }

        public async Task<Image> GetWithIdAsync(int id)
        {
            return await _imageDal.GetAsync(i => i.Id == id);
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
    }
}
