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
using TypeMeApi.ToDoItems.Friend;

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
        public FriendController(IFriendService friendService,  UserManager<AppUser> userManager)
        {
            _friendService = friendService;
            _userManager = userManager;
        }

        // GET api/<FriendController>/5

        [HttpPost]
        [Route("getallfriends")]
        public async Task<ActionResult> GetAllFriends([FromBody] GetFriend getFriends)
        {
            AppUser user = await _userManager.FindByNameAsync(getFriends.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "There is no account with this username." });
            else
            {
                List<FriendToDo> FriendsList = new List<FriendToDo>();
                foreach (Friend friendRel in await _friendService.GetAllFriends(user.UserName,getFriends.Status))
                {
                    if (friendRel.FromUserName != user.UserName)
                    {
                        AppUser friendUser = await _userManager.FindByNameAsync(friendRel.FromUserName);
                        FriendToDo friend = new FriendToDo
                        {
                            Email = friendUser.Email,
                            Name = friendUser.Name,
                            Surname = friendUser.Surname,
                            Image = friendUser.Image,
                            Username = friendUser.UserName,
                            Gender = friendUser.Gender,
                            Birthday = friendUser.Birthday,
                            Isfromuser =false,
                        };
                        FriendsList.Add(friend);

                    }
                    else if (friendRel.ToUserName != user.UserName)
                    {
                        AppUser friendUser = await _userManager.FindByNameAsync(friendRel.ToUserName);
                        FriendToDo friend = new FriendToDo
                        {
                            Email = friendUser.Email,
                            Name = friendUser.Name,
                            Surname = friendUser.Surname,
                            Image = friendUser.Image,
                            Username = friendUser.UserName,
                            Gender = friendUser.Gender,
                            Birthday = friendUser.Birthday,
                            Isfromuser = true,
                        };
                        FriendsList.Add(friend);
                    }
                    else
                    {
                        return Ok(new
                        {
                            friends = FriendsList,
                        });
                    }

                }

                return Ok(new
                {
                    friends = FriendsList,
                });
            }
        }

        [HttpPost]
        [Route("addfriend")]
        public async Task AddFriend([FromBody] AddFriend addFriend)
        {
            if (await _friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername) != null)
            {
                await _friendService.Update(await _friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername), 1);
            }
            else if (await _friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername) == null)
            {
                Friend friend = new Friend
                {
                    FromUserName = addFriend.Fromusername,
                    ToUserName = addFriend.Tousername,
                    StatusId = 3
                };
                await _friendService.Add(friend);
            }
        }

        // DELETE api/<FriendController>/5
        [HttpDelete("{deletefriend}")]
        public async Task Delete([FromBody] DeleteFriend deleteFriend)
        {
            Friend fromFriend = await _friendService.Get(deleteFriend.Fromusername, deleteFriend.Tousername);
            Friend toFriend = await _friendService.Get(deleteFriend.Tousername, deleteFriend.Fromusername);
            if (fromFriend != null && fromFriend.StatusId == 1)
            {

                fromFriend.FromUserName = deleteFriend.Tousername;
                fromFriend.ToUserName = deleteFriend.Fromusername;
                await _friendService.Update(fromFriend, 3);
            }
            else if (fromFriend != null && fromFriend.StatusId == 3)
            {

                await _friendService.Delete(fromFriend);
            }

            else if (toFriend != null && toFriend.StatusId == 1)
            {

                await _friendService.Update(toFriend, 3);
            }
            else if (toFriend != null && toFriend.StatusId == 3)
            {

                await _friendService.Delete(toFriend);
            }
        }
    }
}
