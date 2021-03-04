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
        //private readonly IStatusService _statusService;
        private readonly IFriendService _friendService;
        public ProfileController(UserManager<AppUser> userManager, IFriendService friendService, IWebHostEnvironment env)
        {
            _userManager = userManager;
            _friendService = friendService;
            _env = env;
            //_statusService = statusService;
        }
        // GET: api/<ProfileController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
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
        [HttpPost]
        [Route("changeimage")]
        public async Task<ActionResult> ProfileImage([FromForm] ChangeImage profile)
        {
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });
            string folder = Path.Combine("images", "profile");
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);

            AppUser user = await _userManager.FindByNameAsync(profile.Username);

            user.Image = "http://jrcomerun-001-site1.ftempurl.com/images/profile/" + filename;
            await _userManager.UpdateAsync(user);
            return Ok();
        }

        // PUT api/<ProfileController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ProfileController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
