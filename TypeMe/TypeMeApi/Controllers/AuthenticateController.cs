using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using TypeMeApi.DAL;
using TypeMeApi.Extentions;
using TypeMeApi.ToDoItems;
using TypeMeApi.ToDoItems.Authenticate;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class AuthenticateController : ControllerBase
    {
        #region Properties                                   >>>  Properties  <<<
        private readonly UserManager<AppUser> _userManager;
        public IConfiguration Configuration { get; }
        #endregion

        #region Authenticate Constructor                     >>>     CTOR     <<<
        public AuthenticateController(UserManager<AppUser> userManager, IConfiguration configuration)
        {
            _userManager = userManager;
            Configuration = configuration;
        }
        #endregion

        #region Get users in search                          >>>      Get     <<<
        [HttpGet]
        public ActionResult GetUsers()
        {
            List<AppUser> allUsers = _userManager.Users.Where(u => u.EmailConfirmed == true).Take(20).ToList();
            List<UserToDo> users = new List<UserToDo>();
            foreach (AppUser user in allUsers)
            {
                UserToDo userToDo = new UserToDo
                {
                    Email = user.Email,
                    Name = user.Name,
                    Surname = user.Surname,
                    Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + user.Image,
                    Username = user.UserName,
                    Gender = user.Gender,
                };
                users.Add(userToDo);
            }
            return Ok(new { users });

        }
        #endregion

        #region  Find users for search                        >>>     Find     <<<
        [HttpPost]
        [Route("find")]
        public ActionResult Find([FromBody] GetUser getUser)
        {
            List<AppUser> allUsers = _userManager.Users.Where(u => u.Name.Contains(getUser.Key) || u.Surname.Contains(getUser.Key)).Skip(getUser.Skip).Take(20).ToList();
            List<UserToDo> users = new List<UserToDo>();
            foreach (AppUser user in allUsers)
            {
                UserToDo userToDo = new UserToDo
                {
                    Email = user.Email,
                    Name = user.Name,
                    Surname = user.Surname,
                    Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + user.Image,
                    Username = user.UserName,
                    Gender = user.Gender,
                };
                users.Add(userToDo);
            }
            return Ok(new { users, usersCount = _userManager.Users.Where(u => u.Name.Contains(getUser.Key) || u.Surname.Contains(getUser.Key)).ToList().Count() });

        }
        #endregion

        #region Register User                                >>>   Register   <<<
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
                    await _userManager.DeleteAsync(appUser);
                }

            }
            var birthday = DateTime.ParseExact(register.Birthday, "d-M-yyyy", null);
            string loginId = Guid.NewGuid().ToString("N");
            //UserDetail userDetail = new UserDetail();
            AppUser newUser = new AppUser()
            {
                Email = register.Email,
                Image = "default.png",
                Name = register.Name,
                UserName = loginId,
                Surname = register.Surname,
                Gender = register.Gender,
                Birthday = birthday,
                CreateTime = DateTime.UtcNow,
                //UserDetail = userDetail
            };
            //userDetail.AppUserId = newUser.Id;
            //await _detailService.Add(userDetail);
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
                HttpContext.Session.SetString("finalString", finalString);

                var mailto = newUser.Email;
                var messageBody = $"<div><h3>Hello {newUser.Name}</h3>" +
                    $"</br> <p>We received a request to confirm your Typeme account.</p>"
                    + $"<p>Enter the following password reset code: </p>" +
                $"</br></br><span style='padding: 8px 16px 8px 16px;background-color: #dce1e6;text-align: center;border-radius: 7px;'>{finalString} </span></div>";
                var messageSubject = "Account Confrim";
                //***********     Send Message to Email     ***********
                await Helper.SendMessageAsync(messageSubject, messageBody, mailto);
                AppUser appUser2 = await _userManager.FindByEmailAsync(register.Email);
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(appUser2);

                return Ok(new
                {
                    response = new Response { Status = "Success", Error = "User Registered" },
                    confirmationstring = finalString,
                    confirmationtoken = token.ToString()
                });

            }

        }
        #endregion

        #region Login User                                   >>>    Login     <<<
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
                    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "Your account wasn't confirmed." });
                }
                var signInKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]));
                var token = new JwtSecurityToken(
                    issuer: Configuration["JWT:ValidIssuer"],
                    audience: Configuration["JWT:ValidAudience"],
                    expires: DateTime.Now.AddMinutes(60),
                    claims: authClaim,
                    signingCredentials: new SigningCredentials(signInKey, SecurityAlgorithms.HmacSha256)
                    );
                string image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + user.Image;
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(token),
                    expirationDate = token.ValidTo,
                    user = new { user.Name, user.Surname, image, user.Gender, user.Birthday, user.Email, username = user.UserName }

                });
            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "Email or password wrong." });
            }

        }
        #endregion

        #region Verify User Email                            >>>    Verify    <<< 
        [HttpPost]
        [Route("verifyemail")]
        public async Task<ActionResult> VerifyEmail([FromBody] Verify EmailToken)
        {
            //var finalString = HttpContext.Session.GetString("finalString");
            AppUser user = await _userManager.FindByEmailAsync(EmailToken.Email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });
            //if (finalString == EmailToken.Token)
            //{
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
            //}
            //else
            //{
            //    return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "Number is wrong. Account wasn't verified." });
            //}
        }
        #endregion

        #region Delete User                                  >>>    Delete    <<<
        [HttpDelete("{delete}")]
        public async Task Delete([FromBody] DeleteUser delete)
        {
            AppUser user = await _userManager.FindByEmailAsync(delete.Email);
            await _userManager.DeleteAsync(user);

        }
        #endregion

        #region Send Email for Reset Password                >>>  Email-Pass  <<<
        [HttpPost]
        [Route("foremailrp")]
        public async Task<IActionResult> ForEmailRP([FromBody] EmailResetPassword emailResetPassword)
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
                confirmationstring = resetToken,
                resettoken = await _userManager.GeneratePasswordResetTokenAsync(user),
            });
        }
        #endregion

        #region Change password                              >>>   Change-P   <<<
        [HttpPost]
        [Route("resetpassword")]
        public async Task<ActionResult> ResetPassword([FromBody] ResetPassword resetPassword)
        {
            AppUser user = await _userManager.FindByEmailAsync(resetPassword.Email);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is no account with this email." });

            IdentityResult identityResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
            if (!identityResult.Succeeded)
            {
                return StatusCode(StatusCodes.Status403Forbidden, new Response { Status = "Error", Error = "There is something wrong. You can't change  password of this account" });
            }

            return Ok();
        }
        #endregion

    }
}