using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IAlbomService
    {
        Task<Albom> GetWithIdAsync(int id);
        Task<Albom> GetWithINameAsync(string name, string AppuserId);
        Task<List<Albom>> GetAlboms(string id);
        Task Add(Albom albom);
        Task Update(Albom albom);
        Task Delete(int id);
    }
}
