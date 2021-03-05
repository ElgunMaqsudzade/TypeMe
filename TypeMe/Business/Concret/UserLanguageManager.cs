using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Business.Concret
{
    public class UserLanguageManager : IUserLanguageService
    {
        private readonly IUserLanguageDal _languageDal;
        public UserLanguageManager(IUserLanguageDal languageDal)
        {
            _languageDal = languageDal;
        }
        public async Task<List<UserLanguage>> GetLanguages()
        {
            return await _languageDal.GetAllAsync();
        }

        public async Task<UserLanguage> GetWithIdAsync(int id)
        {
            return await _languageDal.GetAsync(s => s.Id == id);
        }
        public async Task Add(UserLanguage language)
        {
            await _languageDal.AddAsync(language);
        }

        public async Task Delete(int id)
        {
            await _languageDal.DeleteAsync(new UserLanguage { Id = id });
        }

        public async Task Update(UserLanguage language)
        {
            await _languageDal.UpdateAsync(language);
        }
    }
}
