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
        Task<Albom> GetWithIdUserAsync(string appUserId,int id);
        Task<Albom> GetWithINameAsync(string name, string appUserId);
        Task<Albom> GetWithCoverAsync(string cover);
        Task<List<Albom>> GetAlboms(string AppuserId);
        Task Add(Albom albom);
        Task Update(Albom albom);
        Task Delete(int id);
    }
}
