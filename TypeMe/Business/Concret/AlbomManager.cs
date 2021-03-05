using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class AlbomManager : IAlbomService
    {
        private readonly IAlbomDal _albomDal;
        public AlbomManager(IAlbomDal albomDal)
        {
            _albomDal = albomDal;
        }
        public async Task<List<Albom>> GetAlboms(string ImageId)
        {
            return await  _albomDal.GetAllAsync();
        }
       
        public async Task<Albom> GetWithIdAsync(int id)
        {
            return await _albomDal.GetAsync(s => s.Id == id);
        }
        public async Task<Albom> GetWithINameAsync(string name, string id)
        {
            return await _albomDal.GetAsync(s => s.Name == name &&s.AppUserId==id);
        }
        public async Task Add(Albom albom)
        {
            await _albomDal.AddAsync(albom);
        }

        public async Task Delete(int id)
        {
            await _albomDal.DeleteAsync(new Albom { Id=id});
        }
        public async Task Update(Albom albom)
        {
            await _albomDal.UpdateAsync(albom);
        }
    }
}
