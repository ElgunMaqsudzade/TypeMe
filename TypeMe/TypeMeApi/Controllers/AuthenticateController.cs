using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TypeMeApi.Identity;
using TypeMeApi.ToDoItems;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        public IConfiguration Configuration { get; }
        public AuthenticateController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            Configuration = configuration;
        }
        // GET: api/<AuthenticateController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { $"{DateTime.Parse("2-2-2020")}", "value2" };
        }

        // GET api/<AuthenticateController>/5
        [HttpGet("{email}", Name = "Get")]
        public async Task<ActionResult<AppUser>> Get(string email)
        {
            AppUser user = await _userManager.FindByEmailAsync(email);
            //if (user == null)
            //{
            //    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "user for This Email was'nt Exists" });
            //}
            return user;
        }

        // POST api/<AuthenticateController>
        [HttpPost]
        [Route("register")]
        public async Task<ActionResult> Register([FromBody] Register register)
        {
            AppUser appUser = await _userManager.FindByEmailAsync(register.Email);
            if (appUser != null)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "This Email Already Exists" });
            }

            var birthday = DateTime.Parse(register.Birthday);
            string loginId = Guid.NewGuid().ToString("N");
            AppUser newUser = new AppUser()
            {
                Email = register.Email,
                Name = register.Name,
                UserName = loginId,
                Surname = register.Surname,
                Gender = register.Gender,
                Birthday = birthday,
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
        [HttpPost]
        [Route("login")]
        public async Task<ActionResult> Login([FromBody] Login login)
        {
            AppUser user = await _userManager.FindByEmailAsync(login.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, login.Password))
            {
                var authClaim = new List<Claim>
                {
                    new Claim(ClaimTypes.Name,user.Email),
                    new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString())

                };
                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaim.Add(new Claim(ClaimTypes.Role, role));
                }
                var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: Configuration["JWT:ValidIssuer"],
                    audience: Configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddMinutes(30),
                    claims: authClaim,
                    signingCredentials: new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256)
                    );
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expirationDate = token.ValidTo,
                    user = user,
                }) ;
            }
            return Unauthorized(new Response { Status = "Error", Error = "Email or Password Wrong" });
        }
        [HttpPost]
        [Route("verifyemail")]
        public async Task<ActionResult> VerifyEmail([FromBody] string email, string token)
        {
            if (email == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "bele bir email yoxdur" });
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "bele bir emailli user yoxdur" });

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "verify ede bilmedin" });
                }

            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "bu email artiq verify olub" });
            }
        }
        // PUT api/<AuthenticateController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AuthenticateController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
