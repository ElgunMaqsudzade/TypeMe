using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.ToDoItems;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class FriendController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly IFriendService _friendService;
        private readonly IStatusService _statusService;
        public FriendController(IFriendService friendService, IStatusService statusService, UserManager<AppUser> userManager)
        {
            _friendService = friendService;
            _statusService = statusService;
            _userManager = userManager;
        }

        // GET api/<FriendController>/5
        [HttpPost]
        [Route("getfriends")]
        public async Task<ActionResult> GetFriends([FromBody] GetFriends getFriends)
        {
            AppUser user = await _userManager.FindByEmailAsync(getFriends.UserName);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "There is no account with this email." });

            if (_friendService.GetFriends(user.Id).Count() == 0)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                 new Response { Status = "Error", Error = "This account hasn't friends" });
            }
            else
            {
                List<FriendToDo> FriendsList = new List<FriendToDo>();
                foreach (Friend friendRel in _friendService.GetFriends(user.Id))
                {
                    if (friendRel.FromUserName != user.Id )
                    {
                        AppUser friendUser = await _userManager.FindByNameAsync(friendRel.FromUserName);
                        FriendToDo friend = new FriendToDo
                        {
                            Email = friendUser.Email,
                            Name = friendUser.Name,
                            Surname = friendUser.Surname,
                            Image = friendUser.Image,
                            Username = friendUser.UserName,
                            Status = _statusService.GetStaWithId(friendRel.StatusId).Name

                        };
                        FriendsList.Add(friend);
                    }
                    else if(friendRel.ToUserName != user.Id)
                    {
                        AppUser friendUser = await _userManager.FindByNameAsync(friendRel.ToUserName);
                        FriendToDo friend = new FriendToDo
                        {
                            Email = friendUser.Email,
                            Name = friendUser.Name,
                            Surname = friendUser.Surname,
                            Image = friendUser.Image,
                            Username = friendUser.UserName,
                            Status = _statusService.GetStaWithId(friendRel.StatusId).Name

                        };
                        FriendsList.Add(friend);
                    }
                    
                   
                }

                return Ok(new
                {
                    friends = FriendsList,
                }) ;
            }
        }

        // POST api/<FriendController>
        [HttpPost]
        public void Post([FromBody] string value)
        {

        }

        // PUT api/<FriendController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FriendController>/5
        [HttpDelete("{deletefriend}")]
        public async Task Delete([FromBody] DeleteFriend deleteFriend)
        {
            AppUser fromUser = await _userManager.FindByEmailAsync(deleteFriend.FromUserName);
            AppUser toUser = await _userManager.FindByEmailAsync(deleteFriend.ToUserName);
            _friendService.Delete(fromUser.Id, toUser.Id);
        }
    }
}
