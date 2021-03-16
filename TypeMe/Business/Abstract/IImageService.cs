using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IImageService
    {
        Task<Image> GetWithIdAsync(int id);
        Task<Image> GetLastImageAsync(int albomId);
        Task<List<Image>> GetImages(int albomId);
        Task DeleteImages(int albomId);
        Task Add(Image image);
        Task Update(Image image);
        Task Delete(int id);
    }
}
