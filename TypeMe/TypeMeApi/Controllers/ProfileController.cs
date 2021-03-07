using Business.Abstract;
using Entity.Entities;
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
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly IAlbomService _albomService;
        private readonly IImageService _imageService;
        private readonly IUserDetailService _detailService;
        private readonly IUserLanguageService _userLanguage;
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
        [HttpGet]
        [Route("getalllanguages")]
        public async Task<ActionResult> GetAllLanguages()
        {
            List<UserLanguage> languages = await _userLanguage.GetLanguages();
            return Ok(languages);
        }

        [HttpGet("{profile}")]
        [Route("getdetailuser")]
        public async Task<ActionResult> GetDetailProfile(Profile profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                new Response { Status = "Error", Error = "There is no account with this username." });
            if (await _detailService.GetWithIdAsync(user.Id) != null)
            {
                UserDetail detail = await _detailService.GetWithIdAsync(user.Id);
                string language = (await _userLanguage.GetWithIdAsync(detail.Id)).Name;
                return Ok(new { language, detail.StatusMessage });
            }
            return Ok();

        }
        [HttpPost]
        [Route("adddetailuser")]
        public async Task<ActionResult> AddDetailProfile(ProfileDetail profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                new Response { Status = "Error", Error = "There is no account with this username." });
            //if (_detailService.GetWithIdAsync(user.Id) != null)
            //{
            //    UserDetail updateDetail = await _detailService.GetWithIdAsync(user.Id);
            //    updateDetail.UserLanguageId = profile.Language;
            //    updateDetail.StatusMessage = profile.Statusmessage;
            //    await _detailService.Update(updateDetail);
            //    return Ok();

            //}
            //else
            //{
            UserDetail addDetail = new UserDetail();
            addDetail.AppUserId = user.Id;

            //addDetail.UserLanguage = await _userLanguage.GetWithIdAsync(1);
            addDetail.UserLanguageId = 1;
            addDetail.StatusMessage = "fhgfhgfh";

            await _detailService.Add(addDetail);

            return Ok();
            //}


        }
        [HttpPost]
        [Route("addetailuser")]
        public async Task<ActionResult> AdDetailProfile(ProfileDetail profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                new Response { Status = "Error", Error = "There is no account with this username." });
            if (_detailService.GetWithIdAsync(user.Id) != null)
            {
                UserDetail updateDetail = await _detailService.GetWithIdAsync(user.Id);
                updateDetail.UserLanguageId = profile.Language;
                updateDetail.StatusMessage = profile.Statusmessage;
                await _detailService.Update(updateDetail);
            }
            else if (_detailService.GetWithIdAsync(user.Id) == null)
            {
                UserDetail addDetail = new UserDetail();
                addDetail.AppUserId = user.Id;

                addDetail.UserLanguageId = profile.Language;
                addDetail.StatusMessage = profile.Statusmessage;

                await _detailService.Add(addDetail);
                user.UserDetail = addDetail;
                await _userManager.UpdateAsync(user);

            }
            return Ok();

        }
        // POST api/<ProfileController>
        [HttpPost]
        [Route("user")]
        public async Task<ActionResult> Profile([FromBody] Profile getProfile)
        {

            AppUser user = await _userManager.FindByNameAsync(getProfile.Username);
            GetProfile profile = new GetProfile
            {
                Email = user.Email,
                Name = user.Name,
                Surname = user.Surname,
                Image = user.Image,
                Username = user.UserName,
                Gender = user.Gender,
                Birthday = user.Birthday,
            };
            return Ok(profile);
        }
        [Consumes("multipart/form-data")]
        [HttpPut("{profile}")]
        [Route("saveimage")]
        public async Task<ActionResult> ProfileSaveImage([FromForm] ChangeImage profile)
        {
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            string folder = Path.Combine("images", "profile");
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);


            Image image = new Image();
            if (await _albomService.GetWithINameAsync("My profile photos", user.Id) == null)
            {
                Albom albom = new Albom();
                albom.AppUserId = user.Id;
                albom.Name = "My profile photos";
                await _albomService.Add(albom);
                image.AlbomId = albom.Id;
            }
            else
            {
                image.AlbomId = (await _albomService.GetWithINameAsync("My profile photos", user.Id)).Id;
            }

            image.Link = "http://elgun20000-001-site1.btempurl.com/images/profile/" + filename;
            await _imageService.Add(image);
            return StatusCode(StatusCodes.Status201Created);
        }
        [Consumes("multipart/form-data")]
        [HttpPut("{profile}")]
        [Route("changeimage")]
        public async Task<ActionResult> ProfileChangeImage([FromForm] ChangeImage profile)
        {
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });
            string folder = Path.Combine("images", "cutedProfile");
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);
            if (user.Image != "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/default.png")
            {
                string path = Path.Combine(_env.WebRootPath, user.Image);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);

                }
            }
            user.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + filename;
            await _userManager.UpdateAsync(user);
            return Ok();
        }

        //DELETE api/<ProfileController>/5
        [HttpDelete("{profile}")]
        [Route("deleteprofileimage")]
        public async Task DeleteProfileImage([FromBody] DeleteProfileImage profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            string path = Path.Combine(_env.WebRootPath, user.Image);
            if (System.IO.File.Exists(path))
            {
                System.IO.File.Delete(path);

            }
            user.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/default.png";
            await _userManager.UpdateAsync(user);
        }
    }
}
