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
using TypeMeApi.Extentions;
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
                if (appUser.EmailConfirmed == true)
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                   new Response { Status = "Error", Error = "This email already exists." });
                }
                else
                {
                    AppUser user = await _userManager.FindByEmailAsync(register.Email);
                    await _userManager.DeleteAsync(user);
                    await _userManager.UpdateAsync(user);
                }

            }

            var birthday = DateTime.ParseExact(register.Birthday, "d-M-yyyy", null);
            string loginId = Guid.NewGuid().ToString("N");
            AppUser newUser = new AppUser()
            {
                Email = register.Email,
                Image="default.png",
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
                var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
                var stringChars = new char[6];
                var random = new Random();
                for (int i = 0; i < stringChars.Length; i++)
                {
                    stringChars[i] = chars[random.Next(chars.Length)];
                }
                var finalString = new String(stringChars);

                var token = await _userManager.GenerateEmailConfirmationTokenAsync(newUser);
                var mailto = newUser.Email;
                var messageBody = $"<div><h3>Hello {newUser.Name}</h3>" +
                    $"</br> <p>We received a request to confirm your Typeme account.</p>"
                    + $"<p>Enter the following password reset code: </p>" +
                $"</br></br><span style='padding: 8px 16px 8px 16px;background-color: #dce1e6;text-align: center;border-radius: 7px;'>{finalString} </span></div>";
                var messageSubject = "Account Confrim";
                //***********     Send Message to Email     ***********
                await Helper.SendMessageAsync(messageSubject, messageBody, mailto);



                return Ok(new
                {
                    response = new Response { Status = "Success", Error = "User Registered" },
                    confirmationstring = finalString,
                    confirmationtoken = token.ToString()
                });

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
                if (user.EmailConfirmed == false)
                {
                    await _userManager.DeleteAsync(user);
                    await _userManager.UpdateAsync(user);
                    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "Your account wasn't confirmed." });
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
                    user = new { user.Name, user.Surname, user.Image, user.Gender, user.Birthday, user.Email }

                });
            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "Email or password wrong." });
            }

        }
        [HttpPost]
        [Route("verifyemail")]
        public async Task<ActionResult> VerifyEmail([FromBody] Verify EmailToken)
        {
            var user = await _userManager.FindByEmailAsync(EmailToken.Email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });

            if (!await _userManager.IsEmailConfirmedAsync(user))
            {
                var result = await _userManager.ConfirmEmailAsync(user, EmailToken.Token);
                if (result.Succeeded)
                {
                    return Ok(new Response { Status = "Ok", Error = "It is verified." });
                }
                else
                {
                    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is something wrong. Account wasn't verified." });
                }

            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is something wrong. Account wasn't verified." });
            }
        }
        // PUT api/<AuthenticateController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {

        }
        // DELETE api/<AuthenticateController>/5
        [HttpDelete("{email}")]
        public async Task Delete([FromBody] Delete delete)
        {

            AppUser user = await _userManager.FindByEmailAsync(delete.Email);
            if (user.EmailConfirmed == false)
            {
                await _userManager.DeleteAsync(user);
                await _userManager.UpdateAsync(user);
            }
        }
        [HttpPost]
        [Route("foremailrp")]
        public async Task<IActionResult> ForEmailRP([FromBody] EmailResetPassword emailResetPassword )
        {
            AppUser user = await _userManager.FindByEmailAsync(emailResetPassword.Email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });
            var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            var stringChars = new char[6];
            var random = new Random();
            for (int i = 0; i < stringChars.Length; i++)
            {
                stringChars[i] = chars[random.Next(chars.Length)];
            }
            var resetToken = new String(stringChars);
            var mailto = emailResetPassword.Email;
            var messageBody = $"<div><h3>Hello {user.Name}</h3>" +
                $"</br> <p>We received a request to reset password your Typeme account.</p>"
                + $"<p>Enter the following password reset code: </p>" +
            $"</br></br><span style='padding: 8px 16px 8px 16px;background-color: #dce1e6;text-align: center;border-radius: 7px;'>{resetToken} </span></div>";
            var messageSubject = "Account Confrim";
            //***********     Send Message to Email     ***********
            await Helper.SendMessageAsync(messageSubject, messageBody, mailto);
            return Ok(new
            {
                response = new Response { Status = "Success", Error = "Message sent for you change  password of account" },
                confirmationstring = resetToken,
            });
        }

        [HttpPost]
        [Route("resetpassword")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPassword resetPassword)
        {
            AppUser user = await _userManager.FindByIdAsync(resetPassword.Email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });

            IdentityResult identityResult = await _userManager.ResetPasswordAsync(user, await _userManager.GeneratePasswordResetTokenAsync(user), resetPassword.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is something wrong. You can't change  password of account" });
            }

            return Ok(new Response { Status = "Ok", Error = "You change  password of account" });
        }
    }
}