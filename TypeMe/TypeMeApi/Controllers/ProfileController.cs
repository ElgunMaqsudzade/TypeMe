using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using TypeMeApi.Extentions;
using TypeMeApi.ToDoItems;
using TypeMeApi.ToDoItems.Profile;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class ProfileController : ControllerBase
    {
        #region Database Services                            >>>>>     Services     <<<<<
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly IAlbomService _albomService;
        private readonly IImageService _imageService;
        private readonly IUserDetailService _detailService;
        private readonly IUserLanguageService _userLanguage;
        #endregion

        #region Profile Constructor                          >>>>>       Ctor       <<<<<
        public ProfileController(UserManager<AppUser> userManager,
                                            IWebHostEnvironment env, IAlbomService albomService,
                                            IImageService imageService, IUserDetailService detailService,
                                            IUserLanguageService userLanguage)
        {
            _userManager = userManager;
            _env = env;
            _albomService = albomService;
            _imageService = imageService;
            _imageService = imageService;
            _detailService = detailService;
            _userLanguage = userLanguage;
        }
        #endregion

        #region Get all Languages for User                   >>>>>     Languages    <<<<<
        [HttpGet()]
        [Route("getalllanguages")]
        public async Task<ActionResult> GetAllLanguages()
        {
            List<UserLanguage> languages = await _userLanguage.GetLanguages();
            return Ok(languages);
        }
        #endregion

        #region Get User Detail                              >>>>>     GetDetail    <<<<<
        [HttpGet("{profile}")]
        [Route("getdetailuser")]
        public async Task<ActionResult> GetDetailProfile(Profile profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                new Response { Status = "Error", Error = "There is no account with this username." });
            ProfileInfo profileinfo = new ProfileInfo();
            if (await _detailService.GetWithIdAsync(user.Id) != null)
            {
                UserDetail detail = await _detailService.GetWithIdAsync(user.Id);
                if (detail.UserLanguageId != null)
                {
                    profileinfo.Language = (await _userLanguage.GetWithIdAsync((int)detail.UserLanguageId)).Name;
                }
                profileinfo.Birthday = user.Birthday.ToString("MMMM d, yyyy");
                return Ok(new { profileinfo, statusmessage = detail.StatusMessage });
            }
            profileinfo.Birthday = user.Birthday.ToString("MMMM d, yyyy");

            string status = "";
            return Ok(new { profileinfo, statusmessage=status });

        }
        #endregion

        #region Add Detail for User                          >>>>>     AddDetail    <<<<<           
        [HttpPut]
        [Route("adddetailuser")]
        public async Task AddDetailProfile(ProfileDetail profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (await _detailService.GetWithIdAsync(user.Id) != null)
            {
                UserDetail updateDetail = await _detailService.GetWithIdAsync(user.Id);
                updateDetail.UserLanguageId = profile.Language;
                updateDetail.StatusMessage = profile.Statusmessage;
                await _detailService.Update(updateDetail);

            }
            else if (await _detailService.GetWithIdAsync(user.Id) == null)
            {
                UserDetail addDetail = new UserDetail();
                addDetail.AppUserId = user.Id;
                addDetail.UserLanguageId = profile.Language;
                addDetail.StatusMessage = profile.Statusmessage;
                await _detailService.Add(addDetail);
            }
        }
        #endregion

        #region  Info for one user                            >>>>>     Info User    <<<<<
        [HttpPost]
        [Route("user")]
        public async Task<ActionResult> Profile([FromBody] Profile getProfile)
        {

            AppUser user = await _userManager.FindByNameAsync(getProfile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
               new Response { Status = "Ok", Error = "There is no account with this username." });
            GetProfile profile = new GetProfile
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + user.Image,
                Username = user.UserName,
                Gender = user.Gender,
                Birthday = user.Birthday,
            };
            return Ok(profile);
        }
        #endregion

        #region Save Profile image in database               >>>>>   Save-Pr-Image  <<<<<
        [Consumes("multipart/form-data")]
        [HttpPut("{profile}")]
        [Route("saveimage")]
        public async Task<ActionResult> ProfileSaveImage([FromForm] ChangeImage profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });

            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
               new Response { Status = "Ok", Error = "There is no account with this username." });
            string folder = Path.Combine("images", "profile");
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);


            Image image = new Image();

            if (await _albomService.GetWithINameAsync("My profile photos", user.Id) == null)
            {
                Albom albom = new Albom();
                albom.AppUserId = user.Id;
                albom.Name = "My profile photos";
                albom.Cover = filename;
                await _albomService.Add(albom);
                image.AlbomId = albom.Id;
            }
            else if (await _albomService.GetWithINameAsync("My profile photos", user.Id) != null)
            {
                Albom albom = await _albomService.GetWithINameAsync("My profile photos", user.Id);
                if (albom.Cover == null || albom.Cover == (await _imageService.GetLastImageAsync(albom.Id)).Link)
                {
                    albom.Cover = filename;
                    await _albomService.Update(albom);
                }
                image.AlbomId = albom.Id;
            }
            image.Link = filename;
            image.AppUserId = user.Id;
            await _imageService.Add(image);
            return StatusCode(StatusCodes.Status201Created);
        }
        #endregion

        #region Change profile image (Cuted version)         >>>>> Save-Cuted-Image <<<<<
        [Consumes("multipart/form-data")]
        [HttpPut("{profile}")]
        [Route("changeimage")]
        public async Task<ActionResult> ProfileChangeImage([FromForm] ChangeImage profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
              new Response { Status = "Ok", Error = "There is no account with this username." });
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });
            string folder = Path.Combine("images", "cutedProfile");
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);
            if (user.Image != "default.png")
            {
                string path = Path.Combine(_env.WebRootPath, user.Image);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
            }
            user.Image = filename;
            await _userManager.UpdateAsync(user);
            return Ok();
        }
        #endregion

        #region Delete profile image (Cuted Version)         >>>>>  Del-Cuted-Image <<<<<
        [HttpDelete("{profile}")]
        [Route("deleteprofileimage")]
        public async Task DeleteProfileImage([FromBody] DeleteProfileImage profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            string folder = Path.Combine("images", "cutedProfile");
            string path = Path.Combine(_env.WebRootPath,folder, user.Image);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);
            }
            user.Image = "default.png";
            await _userManager.UpdateAsync(user);
        }
        #endregion

    }
}
