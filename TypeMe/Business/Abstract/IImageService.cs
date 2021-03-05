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
        Task<List<Image>> GetImages(string id);
        Task Add(Image image);
        Task Update(Image image);
        Task Delete(int id);
    }
}
