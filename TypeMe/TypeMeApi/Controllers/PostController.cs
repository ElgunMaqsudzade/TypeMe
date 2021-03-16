using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.ToDoItems;
using TypeMeApi.ToDoItems.Albom;
using TypeMeApi.ToDoItems.Post;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace TypeMeApi.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        #region Database Services                                      >>>>>     Services     <<<<<
        private readonly IPostService _postService;
        private readonly IPostImageService _postImageService;
        private readonly ICommentService _commentService;
        private readonly IImageService _imageService;
        private readonly IFriendService _friendService;
        private readonly ICommentLikeService _commentLike;
        private readonly IPostLikeService _postLike;
        private readonly UserManager<AppUser> _userManager;
        #endregion

        #region PostController Constructor                             >>>>>       CTOR       <<<<<
        public PostController(IPostService postService, IPostImageService postImageService,
                             UserManager<AppUser> userManager, ICommentService commentService,
                             IImageService imageService, IFriendService friendService,
                             IPostLikeService postLike, ICommentLikeService commentLike)
        {
            _postService = postService;
            _postImageService = postImageService;
            _userManager = userManager;
            _commentService = commentService;
            _imageService = imageService;
            _friendService = friendService;
            _commentLike = commentLike;
            _postLike = postLike;
        }
        #endregion

        #region Get Posts  For Friend Username                         >>>>>     Get Posts    <<<<<
        [HttpPost]
        [Route("getposts")]
        public async Task<ActionResult> GetPosts([FromBody] GetPost profile)
        {
            if ((await _friendService.IsFriend(profile.Postusername, profile.Username, 1)) || profile.Username == profile.Postusername)
            {
                List<Post> dbPosts = await _postService.GetPosts(profile.Postusername);
                List<Posts> posts = new List<Posts>();
                foreach (Post dbPost in dbPosts.OrderByDescending(c => c.Id))
                {
                    Posts post = new Posts();
                    post.Description = dbPost.Description;

                    PostIsLike postLike = await _postLike.GetWithIdAsync(dbPost.Id, profile.Username);
                    if (postLike != null)
                    {
                        post.Islike = true;
                    }
                    else if (postLike == null)
                    {
                        post.Islike = false;
                    }
                    post.Likes = await _postLike.LikesCount(dbPost.Id);
                    post.Views = (int)dbPost.ViewCount;
                    post.Id = dbPost.Id;
                    post.Createtime = dbPost.CreateTime;
                    AppUser appUser = await _userManager.FindByNameAsync(profile.Postusername);
                    PostUser user = new PostUser();
                    user.Name = appUser.Name;
                    user.Surname = appUser.Surname;
                    user.Username = appUser.UserName;
                    user.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + appUser.Image;
                    post.User = user;
                    List<Images> images = new List<Images>();
                    List<PostImage> postImages = await _postImageService.GetPostImages(dbPost.Id);
                    if (postImages != null)
                    {
                        foreach (PostImage pI in postImages)
                        {
                            Images image = new Images();
                            Image dbImage = await _imageService.GetWithIdAsync(pI.ImageId);
                            image.Id = dbImage.Id;
                            image.Photo = "http://elgun20000-001-site1.btempurl.com/images/profile/" + dbImage.Link;
                            images.Add(image);
                        }
                    }


                    post.Images = images;
                    post.Commentscount = (await _commentService.GetAllCommentsCount(dbPost.Id));
                    posts.Add(post);
                }
                return Ok(posts);
            }
            else
            {
                return StatusCode(StatusCodes.Status403Forbidden,
                new Response { Status = "Ok", Error = "They are not friends " });
            }
        }
        #endregion

        #region Get Main Comments                                      >>>>>   Get Main Com   <<<<<
        [HttpPost]
        [Route("getcomments")]
        public async Task<ActionResult> GetComments([FromBody] GetComment profile)
        {
            List<Comment> dbComments = await _commentService.GetComments(profile.Postid);
            List<Comments> comments = new List<Comments>();
            foreach (Comment com in dbComments)
            {
                Comments comment = new Comments();
                CommentIsLike commentLike = await _commentLike.GetWithIdAsync(com.Id, profile.Username);
                if (commentLike != null)
                {
                    comment.Islike = true;
                }
                else if (commentLike == null)
                {
                    comment.Islike = false;
                }
                comment.Createtime = com.CreateTime;
                AppUser dbUserCom = await _userManager.FindByNameAsync(com.UserName);
                comment.Id = com.Id;
                comment.Likes = await _commentLike.LikesCount(com.Id);
                comment.Description = com.Description;
                PostUser userCom = new PostUser();
                userCom.Name = dbUserCom.Name;
                userCom.Surname = dbUserCom.Surname;
                userCom.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + dbUserCom.Image;
                userCom.Username = dbUserCom.UserName;
                comment.User = userCom;
                List<Comment> dbchildComments = await _commentService.GetChildComments(com.Id);
                comment.Childcommentscount = dbchildComments.Count();
                comments.Add(comment);
            }
            return Ok(comments);
        }
        #endregion

        #region Get Child Comments                                     >>>>>   Get Child Com  <<<<<
        [HttpPost]
        [Route("getchildcomments")]
        public async Task<ActionResult> GetChildComments([FromBody] GetChildComment profile)
        {
            List<Comment> dbchildComments = await _commentService.GetChildComments(profile.Commentid);
            List<ReplyComment> comments = new List<ReplyComment>();
            foreach (Comment com in dbchildComments)
            {
                ReplyComment childcomment = new ReplyComment();
                CommentIsLike commentLike = await _commentLike.GetWithIdAsync(com.Id, profile.Username);
                if (commentLike != null)
                {
                    childcomment.Islike = true;
                }
                else if (commentLike == null)
                {
                    childcomment.Islike = false;
                }
                childcomment.Createtime = com.CreateTime;
                AppUser dbUserCom = await _userManager.FindByNameAsync(com.UserName);
                childcomment.Id = com.Id;
                childcomment.Likes = await _commentLike.LikesCount(com.Id);
                childcomment.Description = com.Description;
                childcomment.Parentid = com.ParentId;
                childcomment.Replyid = com.ReplyTo;
                PostUser userCom = new PostUser();
                userCom.Name = dbUserCom.Name;
                userCom.Surname = dbUserCom.Surname;
                userCom.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + dbUserCom.Image;
                userCom.Username = dbUserCom.UserName;
                childcomment.User = userCom;
                comments.Add(childcomment);
            }
            return Ok(new { childcomments = comments });

        }
        #endregion

        #region Create post                                            >>>>>    Create Post   <<<<<

        [HttpPut]
        [Route("createpost")]
        public async Task Create([FromBody] CreatePost profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            Post post = new Post();
            post.Description = profile.Description;
            post.Username = profile.Username;
            post.ViewCount = 0;
            post.CreateTime = DateTime.UtcNow;
            await _postService.Add(post);
            if (profile.Imageids != null)
            {
                foreach (int imgId in profile.Imageids)
                {
                    PostImage postImage = new PostImage();
                    postImage.PostId = post.Id;
                    postImage.ImageId = imgId;
                    await _postImageService.Add(postImage);
                }

            }
        }
        #endregion

        #region Create Comment Parent and Child                        >>>>    Create Comment  <<<<
        [HttpPut]
        [Route("createcomment")]
        public async Task AddComment([FromBody] CreateComment profile)
        {
            Comment comment = new Comment();
            comment.PostId = profile.Postid;
            if (profile.Parentid != null)
            {
                comment.ParentId = profile.Parentid;
                comment.ReplyTo = profile.Replyid;
            }
            comment.UserName = profile.Username;
            comment.Description = profile.Description;
            comment.CreateTime = DateTime.UtcNow;
            await _commentService.Add(comment);
        }
        #endregion

        #region Edit post                                              >>>>>    Update Post   <<<<<
        [HttpPut]
        [Route("updatepost")]
        public async Task UpdatePost([FromBody] EditPost profile)
        {
            Post post = await _postService.GetWithIdAsync(profile.Postid);
            List<PostImage> postImages = await _postImageService.GetPostImages(profile.Postid);
            foreach (PostImage pI in postImages)
            {
                await _postImageService.Delete(pI.Id);
            }
            if (profile.Imageids != null)
            {
                foreach (int imgId in profile.Imageids)
                {
                    PostImage postImage = new PostImage();
                    postImage.PostId = post.Id;
                    postImage.ImageId = imgId;
                    await _postImageService.Add(postImage);
                }

            }
            post.Description = profile.Description;
            await _postService.Update(post);

        }
        #endregion

        #region Edit Comment                                           >>>>>  Update Comment  <<<<<
        [HttpPut]
        [Route("updatecomment")]
        public async Task UpdateComment([FromBody] EditComment profile)
        {
            Comment comment = await _commentService.GetWithIdAsync(profile.Commentid);
            comment.Description = profile.Description;
            await _commentService.Update(comment);

        }
        #endregion

        #region Delete Post with it's Comments                         >>>>>    Delete Post   <<<<<

        [HttpDelete]
        [Route("deletepost")]
        public async Task DeletePost([FromBody] GetComment profile)
        {
            Post post = await _postService.GetWithIdAsync(profile.Postid);
            List<PostImage> postImages = await _postImageService.GetPostImages(profile.Postid);
            foreach (PostImage pI in postImages)
            {
                await _postImageService.Delete(pI.Id);
            }
            List<Comment> comments = await _commentService.GetAllComments(profile.Postid);

            if (comments.Count() > 0)
            {
                foreach (Comment com in comments)
                {
                    await _commentService.Delete(com.Id);
                }
            }
            await _postService.Delete(post.Id);
        }
        #endregion

        #region Delete Comments                                        >>>>>  Delete Comment  <<<<<
        [HttpDelete]
        [Route("deletecomment")]
        public async Task DeleteComment([FromBody] GetChildComment profile)
        {
            Comment comment = await _commentService.GetWithIdAsync(profile.Commentid);
            List<Comment> comments = await _commentService.GetChildComments(profile.Commentid);
            if (comments.Count() > 0)
            {
                foreach (Comment child in comments)
                {
                    await _commentService.Delete(child.Id);
                }
            }
            await _commentService.Delete(comment.Id);
        }
        #endregion

        #region    Like Post                                              >>>>>     Like Post    <<<<<
        [HttpPut]
        [Route("likepost")]
        public async Task ToLikePost([FromBody] LikePost profile)
        {
            PostIsLike likePost = new PostIsLike();
            likePost.PostId = profile.Postid;
            likePost.Username = profile.Username;
            await _postLike.Add(likePost);
        }
        #endregion

        #region UnLike Post                                            >>>>>    UnLike Post   <<<<<
        [HttpDelete]
        [Route("unlikepost")]
        public async Task DeleteLikePost([FromBody] LikePost profile)
        {
            PostIsLike likePost = await _postLike.GetWithIdAsync(profile.Postid, profile.Username);
            await _postLike.Delete(likePost.Id);
        }
        #endregion

        #region Like Comment                                           >>>>>   Like Comment   <<<<<
        [HttpPut]
        [Route("likecomment")]
        public async Task ToLikeComment([FromBody] LikeComment profile)
        {
            CommentIsLike likeComment = new CommentIsLike();
            likeComment.CommentId = profile.Commentid;
            likeComment.Username = profile.Username;
            await _commentLike.Add(likeComment);
        }
        #endregion

        #region UnLike Comment                                         >>>>>  UnLike Comment  <<<<<
        [HttpDelete]
        [Route("unlikecomment")]
        public async Task DeleteLikeComment([FromBody] LikeComment profile)
        {
            CommentIsLike likeComment = await _commentLike.GetWithIdAsync(profile.Commentid, profile.Username);
            await _commentLike.Delete(likeComment.Id);
        }
        #endregion

        #region Get News (Posts)                                       >>>>>   News (Posts)   <<<<<
        [HttpPost]
        [Route("getnews")]
        public async Task<ActionResult> GetNews([FromBody] GetNews profile)
        {
            List<string> friends = await _friendService.GetAllFriendsUsername(profile.Username, 1);
            List<Posts> posts = new List<Posts>();


            foreach (string friend in friends)
            {
                List<Post> dbPosts = await _postService.GetNewsAsync(friend, profile.Skip, 20);


                foreach (Post dbPost in dbPosts)
                {
                    Posts post = new Posts();
                    post.Description = dbPost.Description;

                    PostIsLike postLike = await _postLike.GetWithIdAsync(dbPost.Id, profile.Username);
                    if (postLike != null)
                    {
                        post.Islike = true;
                    }
                    else if (postLike == null)
                    {
                        post.Islike = false;
                    }
                    post.Likes = await _postLike.LikesCount(dbPost.Id);
                    post.Views = (int)dbPost.ViewCount;
                    post.Id = dbPost.Id;
                    post.Createtime = dbPost.CreateTime;
                    AppUser appUser = await _userManager.FindByNameAsync(friend);
                    PostUser user = new PostUser();
                    user.Name = appUser.Name;
                    user.Surname = appUser.Surname;
                    user.Username = appUser.UserName;
                    user.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + appUser.Image;
                    post.User = user;
                    List<Images> images = new List<Images>();
                    List<PostImage> postImages = await _postImageService.GetPostImages(dbPost.Id);
                    if (postImages != null)
                    {
                        foreach (PostImage pI in postImages)
                        {
                            Images image = new Images();
                            Image dbImage = await _imageService.GetWithIdAsync(pI.ImageId);
                            image.Id = dbImage.Id;
                            image.Photo = "http://elgun20000-001-site1.btempurl.com/images/profile/" + dbImage.Link;
                            images.Add(image);
                        }
                    }
                    post.Images = images;
                    post.Commentscount = (await _commentService.GetAllCommentsCount(dbPost.Id));
                    posts.Add(post);
                }
            }

            return Ok(posts.OrderByDescending(c => c.Id));
        }
        #endregion

        #region Get Liked (Posts)                                       >>>>>   Liked (Posts)   <<<<<
        [HttpPost]
        [Route("getposts")]
        public async Task<ActionResult> GetLikedPosts([FromBody] GetPost profile)
        {
            List<Post> dbPosts = await _postService.GetPosts(profile.Postusername);
            List<Posts> posts = new List<Posts>();
            foreach (Post dbPost in dbPosts.OrderByDescending(c => c.Id))
            {
                Posts post = new Posts();
                post.Description = dbPost.Description;

                PostIsLike postLike = await _postLike.GetWithIdAsync(dbPost.Id, profile.Username);
                if (postLike != null)
                {
                    post.Islike = true;
                }
                else if (postLike == null)
                {
                    post.Islike = false;
                }
                post.Likes = await _postLike.LikesCount(dbPost.Id);
                post.Views = (int)dbPost.ViewCount;
                post.Id = dbPost.Id;
                post.Createtime = dbPost.CreateTime;
                AppUser appUser = await _userManager.FindByNameAsync(profile.Postusername);
                PostUser user = new PostUser();
                user.Name = appUser.Name;
                user.Surname = appUser.Surname;
                user.Username = appUser.UserName;
                user.Image = "http://elgun20000-001-site1.btempurl.com/images/cutedProfile/" + appUser.Image;
                post.User = user;
                List<Images> images = new List<Images>();
                List<PostImage> postImages = await _postImageService.GetPostImages(dbPost.Id);
                if (postImages != null)
                {
                    foreach (PostImage pI in postImages)
                    {
                        Images image = new Images();
                        Image dbImage = await _imageService.GetWithIdAsync(pI.ImageId);
                        image.Id = dbImage.Id;
                        image.Photo = "http://elgun20000-001-site1.btempurl.com/images/profile/" + dbImage.Link;
                        images.Add(image);
                    }
                }


                post.Images = images;
                post.Commentscount = (await _commentService.GetAllCommentsCount(dbPost.Id));
                posts.Add(post);
            }
            return Ok(posts);
        }
        #endregion
    }
}
