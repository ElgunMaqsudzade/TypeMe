using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IRecycleBinService
    {
        Task<RecycleBin> GetWithIdAsync(int imageId);
        Task<List<RecycleBin>> GetRecycleBins(string userName);
        Task Add(RecycleBin recycleBin);
        Task Update(RecycleBin recycleBin);
        Task Delete(int id);
        Task DeleteAllImages(string userName);
        Task DeleteListImages(List<int> imageId);

    }
}
