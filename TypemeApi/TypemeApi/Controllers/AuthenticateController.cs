using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TypemeApi.Models;
using TypemeApi.ToDoItems;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypemeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        public AuthenticateController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }
        [HttpPost]
        [Route("register")]
        public async Task<IActionResult> Register([FromBody] Register register)
        {
            AppUser appUser = await _userManager.FindByEmailAsync(register.Email);
            if (appUser != null)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "This Email Already Exists" });
            }
            string loginId = Guid.NewGuid().ToString("N");
            AppUser newUser = new AppUser()
            {
                Email = register.Email,
                Name = register.Name,
                UserName = loginId,
                Surname = register.Surname,
                Gender = register.Gender,
                //BirthDay = new DateTime(1974, 7, 10, 7, 10, 24),
                CreateTime = DateTime.UtcNow,
            };
            IdentityResult identityResult = await _userManager.CreateAsync(newUser, register.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Password is not valid" });
            }
            else
            {
                return Ok(new Response { Status = "Success", Error = "User Registered" });
            }

        }
    }
}
