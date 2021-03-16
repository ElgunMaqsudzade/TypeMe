using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class RecycleBinManager : IRecycleBinService
    {
        private readonly IRecycleBinDal _recycleBinDal;
        public RecycleBinManager(IRecycleBinDal recycleBinDal)
        {
            _recycleBinDal = recycleBinDal;
        }
        public async Task<List<RecycleBin>> GetRecycleBins(string userName)
        {
            return await _recycleBinDal.GetAllAsync(r => r.Username == userName);
        }

        public async Task<RecycleBin> GetWithIdAsync(int imageId)
        {
            return await _recycleBinDal.GetAsync(r => r.ImageId == imageId);
        }
        public async Task Add(RecycleBin recycleBin)
        {
            await _recycleBinDal.AddAsync(recycleBin);
        }

        // Delete metodunun  duuuuuuud .....
        public async Task Delete(int id)
        {
            await _recycleBinDal.DeleteAsync(new RecycleBin { Id=id});
        }

        public async Task Update(RecycleBin recycleBin)
        {
            await _recycleBinDal.UpdateAsync(recycleBin);
        }

        public async Task DeleteAllImages(string userName)
        {
            foreach (RecycleBin r in await _recycleBinDal.GetAllAsync(r => r.Username == userName))
            {
                await _recycleBinDal.DeleteAsync(new RecycleBin { Id = r.Id });
            } 

        }

        public async Task DeleteListImages(List<int> imageId)
        {
            foreach (int id in imageId)
            {
                await _recycleBinDal.DeleteAsync(new RecycleBin { ImageId = id });
            }
        }
    }
}
