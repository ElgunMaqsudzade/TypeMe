using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Abstract
{
    public interface IUserLanguageService
    {
        Task<UserLanguage> GetWithIdAsync(int id);
        Task<List<UserLanguage>> GetLanguages();
        Task Add(UserLanguage language);
        Task Update(UserLanguage language);
        Task Delete(int id);
    }
}
