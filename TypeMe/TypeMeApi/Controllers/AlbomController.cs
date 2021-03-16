using Business.Abstract;
using Entity.Entities;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.Extentions;
using TypeMeApi.ToDoItems;
using TypeMeApi.ToDoItems.Albom;

namespace TypeMeApi.Controllers
{
  
    [Route("api/[controller]")]
    [ApiController]
    public class AlbomController : ControllerBase
    {
        #region Database Services                                    >>>>>      Services      <<<<<
        private readonly UserManager<AppUser> _userManager;
        private readonly IWebHostEnvironment _env;
        private readonly IAlbomService _albomService;
        private readonly IImageService _imageService;
        private readonly IRecycleBinService _binService;
        private readonly IPostImageService _postImageService;
        #endregion

        #region Albom Constructor                                    >>>>>        Ctor        <<<<<
        public AlbomController(UserManager<AppUser> userManager,
                                             IWebHostEnvironment env, IAlbomService albomService,
                                             IImageService imageService, IRecycleBinService binService
                                             , IPostImageService postImageService)
        {
            _userManager = userManager;
            _env = env;
            _albomService = albomService;
            _imageService = imageService;
            _binService = binService;
            _postImageService = postImageService;
        }
        #endregion

        #region Get User Alboms                                      >>>>>      Get Alboms    <<<<<  
        [HttpGet("{profile}")]
        [Route("getuseralboms")]
        public async Task<ActionResult> GetUserAlboms([FromBody] GetAlbom profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
               new Response { Status = "Error", Error = "There is no account with this username." });
            List<Albom> dbAlboms = await _albomService.GetAlboms(user.Id);
            List<Alboms> alboms = new List<Alboms>();

            foreach (Albom al in dbAlboms)
            {
                List<Images> images = new List<Images>();
                Alboms albom = new Alboms();
                foreach (Image dbImage in await _imageService.GetImages(al.Id))
                {
                    Images image = new Images();
                    image.Id = dbImage.Id;
                    image.Photo = "http://elgun20000-001-site1.btempurl.com/images/profile/" + dbImage.Link;
                    images.Add(image);
                }

                albom.Id = al.Id;
                albom.Name = al.Name;
                if (al.Cover != null)
                {
                    albom.Cover = "http://elgun20000-001-site1.btempurl.com/images/profile/" + al.Cover;
                }
                albom.Images = images;
                alboms.Add(albom);
            }
            return Ok(alboms);
        }
        #endregion

        #region Add Albom to User                                    >>>>>      Add Alboms    <<<<<
        [HttpPut("{profile}")]
        [Route("adduseralbom")]
        public async Task AddUserAlbom([FromBody] AddAlbom profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            Albom albom = new Albom();
            albom.AppUserId = user.Id;
            albom.Name = profile.Albumname;
            await _albomService.Add(albom);
        }
        #endregion

        #region Change Albom to User                                 >>>>  Change Cover Albom  <<<<
        [HttpPut("{profile}")]
        [Route("changecoveralbom")]
        public async Task ChangeCoverAlbom([FromBody] ChangeCoverAlbom profile)
        {
            Albom albom = await _albomService.GetWithIdAsync(profile.Albumid);
            albom.Cover = (await _imageService.GetWithIdAsync(profile.ImageId)).Link;
            await _albomService.Update(albom);
        }
        #endregion

        #region Edit Name  Albom                                     >>>>>     Edit Albom     <<<<<
        [HttpPut("{profile}")]
        [Route("editalbom")]
        public async Task EditAlbom([FromBody] EditAlbom profile)
        {
            Albom albom = await _albomService.GetWithIdAsync(profile.Albumid);
            albom.Name = profile.Albumname;
            await _albomService.Update(albom);

        }
        #endregion

        #region Save Image to Albom                                  >>>>>      Save Image    <<<<<
        [Consumes("multipart/form-data")]
        [HttpPut("{saveimage}")]
        [Route("saveimage")]
        public async Task<ActionResult> SaveImage([FromForm] SaveImage profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (profile.Photo == null) return StatusCode(StatusCodes.Status403Forbidden,
                    new Response { Status = "Error", Error = "Please select PHOTO ." });
            if (!profile.Photo.IsImage()) return StatusCode(StatusCodes.Status403Forbidden,
                     new Response { Status = "Error", Error = "Please select image type ." });

            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
               new Response { Status = "Ok", Error = "There is no account with this username." });
            string folder = Path.Combine("images", "profile");
            string filename = await profile.Photo.SaveImageAsync(_env.WebRootPath, folder);
            Image image = new Image();
            if (profile.AlbumId != null)
            {
                Albom albom = await _albomService.GetWithIdAsync((int)profile.AlbumId);
                if (albom.Cover == null || albom.Cover == (await _imageService.GetLastImageAsync(albom.Id)).Link)
                {
                    albom.Cover = filename;
                    await _albomService.Update(albom);
                }
                image.AlbomId = albom.Id;
                image.Link = filename;
                image.AppUserId = user.Id;
                await _imageService.Add(image);
                int imageid = (await _imageService.GetLastImageAsync(albom.Id)).Id;
                return StatusCode(StatusCodes.Status201Created, new { imageid });
            }
            else if (profile.AlbumId == null)
            {
                if (await _albomService.GetWithINameAsync("Photos on my wall", user.Id) == null)
                {
                    Albom albom = new Albom();
                    albom.AppUserId = user.Id;
                    albom.Name = "Photos on my wall";
                    albom.Cover = filename;
                    await _albomService.Add(albom);
                    image.AlbomId = albom.Id;
                }
                else if (await _albomService.GetWithINameAsync("Photos on my wall", user.Id) != null)
                {
                    Albom albom = await _albomService.GetWithINameAsync("Photos on my wall", user.Id);
                    if (albom.Cover == null || albom.Cover == (await _imageService.GetLastImageAsync(albom.Id)).Link)
                    {
                        albom.Cover = filename;
                        await _albomService.Update(albom);
                    }
                    image.AlbomId = albom.Id;
                }
                image.Link = filename;
                image.AppUserId = user.Id;
                await _imageService.Add(image);
                int imageid = (await _imageService.GetLastImageAsync((await _albomService.GetWithINameAsync("Photos on my wall", user.Id)).Id)).Id;
                return StatusCode(StatusCodes.Status201Created, new { imageid });
            }
            return Ok();
        }
        #endregion

        #region Change Image's Albom                                 >>>  Change Image's Albom  <<<
        [HttpPut("{profile}")]
        [Route("changeimagealbom")]
        public async Task ChangeImageAlbom([FromBody] ChangeAlbom profile)
        {
            foreach (int imgid in profile.Imageids)
            {
                Image image = await _imageService.GetWithIdAsync(imgid);
                image.AlbomId = profile.Albumid;
                await _imageService.Update(image);
                RecycleBin recycle= await _binService.GetWithIdAsync(imgid);
                if (recycle != null)
                {
                    await _binService.Delete(recycle.Id);
                }
            }

        }
        #endregion

        #region Delete Image from Albom to Recycle Bin               >>>>>     Delete Image   <<<<<
        [HttpDelete("{profile}")]
        [Route("deleteimage")]
        public async Task DeleteImage([FromBody] DeleteImage profile)
        {
            Image image = await _imageService.GetWithIdAsync(profile.Imageid);

            Albom albom = await _albomService.GetWithIdAsync((int)image.AlbomId);

            List<Image> albumimages = (await _imageService.GetImages(albom.Id));
            if (albom.Cover == image.Link)
            {
                if( albumimages.Count()==1)
                {
                    albom.Cover = null;
                }
                else if(albumimages.Count()>1)
                {
                    foreach (Image img in albumimages)
                    {
                        if (img.Link != image.Link)
                        {
                            albom.Cover = img.Link;
                            break;
                        }
                    }
                   
                }
            }
            image.AlbomId = null;
            await _albomService.Update(albom);
            await _imageService.Update(image);
            RecycleBin recycleBin = new RecycleBin();
            recycleBin.ImageId = image.Id;
            recycleBin.Username = profile.Username;
            await _binService.Add(recycleBin);
        }
        #endregion  

        #region Delete Images from Albom to Recycle Bin              >>>>    Delete List<img> <<<<<
        [HttpDelete("{profile}")]
        [Route("deleteimagelist")]
        public async Task DeleteListImage([FromBody] DeleteImageList profile)
        {
            foreach (int imgid in profile.Imageids)
            {
                Image image = await _imageService.GetWithIdAsync(imgid);
                Albom albom = await _albomService.GetWithIdAsync((int)image.AlbomId);

                List<Image> albumimages = (await _imageService.GetImages(albom.Id));
                if (albom.Cover == image.Link)
                {
                    if (albumimages.Count() == 1)
                    {
                        albom.Cover = null;
                    }
                    else if (albumimages.Count() > 1)
                    {
                        foreach (Image img in albumimages)
                        {
                            if (img.Link != image.Link)
                            {
                                albom.Cover = img.Link;
                                break;
                            }
                        }

                    }
                }
                image.AlbomId = null;
                await _albomService.Update(albom);
                await _imageService.Update(image);
                RecycleBin recycleBin = new RecycleBin();
                recycleBin.ImageId = image.Id;
                recycleBin.Username = profile.Username;
                await _binService.Add(recycleBin);
            }
        }
        #endregion

        #region Delete Image from Recycle Bin                        >>>>>     Delete Image   <<<<<
        [HttpDelete("{profile}")]
        [Route("fromrecyclebin")]
        public async Task DeleteImagefromRecycle([FromBody] FromRecycleDel profile)
        {
            foreach (int imgId in profile.Imageids)
            {
                RecycleBin recycle = await _binService.GetWithIdAsync(imgId);
                await _binService.Delete(recycle.Id);
                Image image = await _imageService.GetWithIdAsync(imgId);
                string folder = Path.Combine("images", "profile");
                string path = Path.Combine(_env.WebRootPath, folder, image.Link);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
                await _imageService.Delete(image.Id);
                List<PostImage> postImages= await _postImageService.GetPostImageswithImageId(imgId);
                foreach (PostImage pI in postImages)
                {
                    await _postImageService.Delete(pI.Id);
                }
            }


        }
        #endregion

        #region Delete all Images from Recycle Bin                   >>>>>    Delete Images   <<<<<
        [HttpDelete("{profile}")]
        [Route("deleteall")]
        public async Task DeleteAllImages([FromBody] DeleteAllImages profile)
        {
            await _binService.DeleteAllImages(profile.Username);
            
            foreach (RecycleBin r in (await _binService.GetRecycleBins(profile.Username)))
            {
                
                Image image = await _imageService.GetWithIdAsync(r.ImageId);
                string folder = Path.Combine("images", "profile");
                string path = Path.Combine(_env.WebRootPath, folder, image.Link);
                if (System.IO.File.Exists(path))
                {
                    System.IO.File.Delete(path);
                }
                await _imageService.Delete(image.Id);
                await _binService.Delete(r.Id);
            }

        }
        #endregion

        #region Delete Albom with Images                             >>>>>     Delete Albom   <<<<<
        [HttpDelete("{profile}")]
        [Route("deletealbom")]
        public async Task DeleteAlbom([FromBody] DeleteAlbom profile)
        {
            List<Image> images = await _imageService.GetImages(profile.Albumid);
            if (images != null)
            {
                foreach (Image image in images)
                {
                    image.AlbomId = null;
                    await _imageService.Update(image);
                    RecycleBin recycleBin = new RecycleBin();
                    recycleBin.ImageId = image.Id;
                    recycleBin.Username = profile.Username;
                    await _binService.Add(recycleBin);
                }

            }
            await _albomService.Delete(profile.Albumid);

        }
        #endregion

        #region Get Recycle Bins                                     >>>>>   Get Recycle Bin  <<<<<  
        [HttpGet("{profile}")]
        [Route("getdeletedimages")]
        public async Task<ActionResult> RecycleBin([FromBody] GetRecycleBin profile)
        {
            AppUser user = await _userManager.FindByNameAsync(profile.Username);
            if (user == null) return StatusCode(StatusCodes.Status403Forbidden,
               new Response { Status = "Error", Error = "There is no account with this username." });
            List<RecycleBin> recycleBins = await _binService.GetRecycleBins(profile.Username);
            List<DeletedImage> deletedImages = new List<DeletedImage>();
            foreach (RecycleBin rec in recycleBins)
            {
                Image dbimage = await _imageService.GetWithIdAsync(rec.ImageId);
                DeletedImage deletedImage = new DeletedImage();
                deletedImage.Id = dbimage.Id;
                deletedImage.Photo = "http://elgun20000-001-site1.btempurl.com/images/profile/" + dbimage.Link;
                deletedImages.Add(deletedImage);
            }
            return Ok(new { images = deletedImages });
        }
        #endregion

    }
}
