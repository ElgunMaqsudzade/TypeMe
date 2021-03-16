using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.ToDoItems;
using TypeMeApi.ToDoItems.Settings;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SettingsController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IUserDetailService _detailService;
        public SettingsController(UserManager<AppUser> userManager, IUserDetailService detailService)
        {
            _userManager = userManager;
            _detailService = detailService;
        }

        [HttpPut]
        [Route("changedetail")]
        public async Task UpdateDetail( [FromBody] UpdateUser profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.UserName);
            user.Name = profile.Name;
            user.Birthday = profile.Birthday;
            user.Gender = profile.Gender;
            user.Surname = profile.Surname;

            if (profile.Languageid!= null)
            {
                UserDetail detail = await _detailService.GetWithIdAsync(user.Id);
                if (detail != null)
                {
                    detail.UserLanguageId = profile.Languageid;
                    await _detailService.Update(detail);
                }
                else if (detail == null)
                {
                    UserDetail newDetail = new UserDetail();
                    newDetail.UserLanguageId = profile.Languageid;
                    await _detailService.Add(newDetail);
                }
            }
        }

        [HttpPost]
        [Route("changepassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePassword profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });
            IdentityResult identityResult = await _userManager.ChangePasswordAsync(user, profile.Oldpassword, profile.Newpassword);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is something wrong. You can't change  password of this account" });
            }
            return Ok();
        }
    }
}
