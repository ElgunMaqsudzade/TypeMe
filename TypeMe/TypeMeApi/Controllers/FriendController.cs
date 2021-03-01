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
        public async Task<ActionResult> GetFriends([FromBody] GetFriend getFriends)
        {
            AppUser user = await _userManager.FindByNameAsync(getFriends.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "There is no account with this username." });

            if (_friendService.GetFriends(user.UserName).Count() == 0)
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                 new Response { Status = "Error", Error = "This account doesn't have friends" });
            }
            else
            {
                List<FriendToDo> FriendsList = new List<FriendToDo>();
                foreach (Friend friendRel in _friendService.GetFriends(user.UserName))
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
                            Status = _statusService.GetStaWithId(friendRel.StatusId).Name,
                            Isfromuser = false,
                            Gender = friendUser.Gender,
                            Birthday = friendUser.Birthday,
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
                            Status = _statusService.GetStaWithId(friendRel.StatusId).Name,
                            Isfromuser = true,
                            Gender = friendUser.Gender,
                            Birthday = friendUser.Birthday,
                        };
                        FriendsList.Add(friend);
                    }

                }

                return Ok(new
                {
                    friends = FriendsList,
                });
            }
        }
        //[HttpPost]
        //[Route("findfriends")]
        //public async Task<ActionResult> FindFriends([FromBody] GetFriend getFriends)
        //{
        //    AppUser user = await _userManager.FindByNameAsync(getFriends.Username);
        //    if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
        //             new Response { Status = "Error", Error = "There is no account with this username." });

        //    if (_friendService.GetFriends(user.UserName).Count() == 0)
        //    {
        //        return StatusCode(StatusCodes.Status403Forbidden,
        //         new Response { Status = "Error", Error = "This account doesn't have friends" });
        //    }
        //    else
        //    {
        //        List<FriendToDo> FriendsList = new List<FriendToDo>();
        //        foreach (Friend friendRel in _friendService.GetFriends(user.UserName))
        //        {
        //            if (friendRel.FromUserName != user.UserName)
        //            {
        //                AppUser friendUser = await _userManager.FindByNameAsync(friendRel.FromUserName);
        //                if (friendUser.Name.Contains(getFriends.Key) || friendUser.Surname.Contains(getFriends.Key))
        //                {

        //                }
        //                FriendToDo friend = new FriendToDo
        //                {
        //                    Email = friendUser.Email,
        //                    Name = friendUser.Name,
        //                    Surname = friendUser.Surname,
        //                    Image = friendUser.Image,
        //                    Username = friendUser.UserName,
        //                    Status = _statusService.GetStaWithId(friendRel.StatusId).Name,
        //                    Isfromuser = false,
        //                    Gender = friendUser.Gender,
        //                };
        //                FriendsList.Add(friend);
        //            }
        //            else if (friendRel.ToUserName != user.UserName)
        //            {
        //                AppUser friendUser = await _userManager.FindByNameAsync(friendRel.ToUserName);
        //                FriendToDo friend = new FriendToDo
        //                {
        //                    Email = friendUser.Email,
        //                    Name = friendUser.Name,
        //                    Surname = friendUser.Surname,
        //                    Image = friendUser.Image,
        //                    Username = friendUser.UserName,
        //                    Status = _statusService.GetStaWithId(friendRel.StatusId).Name,
        //                    Isfromuser = true,
        //                    Gender = friendUser.Gender,
        //                };
        //                FriendsList.Add(friend);
        //            }

        //        }

        //        return Ok(new
        //        {
        //            friends = FriendsList,
        //        });
        //    }
        //}
        [HttpPost]
        [Route("addfriend")]
        public void AddFriend([FromBody] AddFriend addFriend)
        {
            if (_friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername) != null)
            {
                _friendService.Update(_friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername), 1);
            }
            else if (_friendService.GetFriendWithId(addFriend.Fromusername, addFriend.Tousername) == null)
            {
                Friend friend = new Friend
                {
                    FromUserName = addFriend.Fromusername,
                    ToUserName = addFriend.Tousername,
                    StatusId = 3
                };
                _friendService.Add(friend);
            }
        }

        // DELETE api/<FriendController>/5
        [HttpDelete("{deletefriend}")]
        public void Delete([FromBody] DeleteFriend deleteFriend)
        {
            Friend fromFriend = _friendService.Get(deleteFriend.Fromusername, deleteFriend.Tousername);
            Friend toFriend = _friendService.Get(deleteFriend.Tousername, deleteFriend.Fromusername);
            if (fromFriend != null && fromFriend.StatusId == 1)
            {
                _friendService.Update(fromFriend, 3);
            }
            else if (fromFriend != null && fromFriend.StatusId == 3)
            {
                _friendService.Delete(fromFriend);
            }

            else if (toFriend != null && toFriend.StatusId == 1)
            {
                toFriend.FromUserName = deleteFriend.Tousername;
                toFriend.ToUserName = deleteFriend.Fromusername;
                _friendService.Update(toFriend, 3);
            }
            else if (toFriend != null && toFriend.StatusId == 3)
            {
                _friendService.Delete(toFriend);
            }
        }
    }
}
