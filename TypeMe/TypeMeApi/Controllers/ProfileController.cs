using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
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
        private readonly IFriendService _friendService;
        private readonly IImageService _imageService;
        private readonly IUserDetailService _detailService;
        private readonly IUserLanguageService _languageService;
        public ProfileController(UserManager<AppUser> userManager, IFriendService friendService,
                                              IWebHostEnvironment env,IAlbomService albomService,
                                              IImageService imageService, IUserDetailService detailService,
                                              IUserLanguageService languageService)
        {
            _userManager = userManager;
            _friendService = friendService;
            _env = env;
            _albomService = albomService;
            _imageService = imageService;
            _imageService = imageService;
            _detailService = detailService;
            _languageService = languageService;
        }
        // GET: api/<ProfileController>
        [HttpGet("{profile}")]
        [Route("getdetailuser")]
        public async Task<ActionResult> getdetailuser(Profile profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.username);
            UserDetail detail = await _detailService.GetWithIdAsync(user.Id);

            return Ok(new { detail.StatusMessage });
        }

        // POST api/<ProfileController>
        [HttpPost]
        [Route("user")]
        public async Task<ActionResult> Profile([FromBody] Profile getProfile)
        {

            AppUser user = await _userManager.FindByNameAsync(getProfile.username);
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
            
            image.Link = "http://jrcomerun-001-site1.ftempurl.com/images/profile/"+ filename;
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
            if (user.Image != "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png")
            {
                string path = Path.Combine(_env.WebRootPath, user.Image);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);

                }
            }
            user.Image = "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/" + filename;
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
            user.Image = "http://jrcomerun-001-site1.ftempurl.com/images/cutedProfile/default.png";
            await _userManager.UpdateAsync(user);
        }
    }
}
