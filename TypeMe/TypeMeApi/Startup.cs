using Business.Abstract;
using Business.Concret;
using DataAccess.Abstract;
using DataAccess.Concret;
using Entity.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TypeMeApi.DAL;

namespace TypeMeApi
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddCors();
            services.AddScoped<IFriendService, FriendManager>();
            services.AddScoped<IFriendDal, EFFriendDal>();
            services.AddScoped<IStatusService, StatusManager>();
            services.AddScoped<IStatusDal, EFStatusDal>();
            services.AddScoped<IUserDetailService, UserDetailManager>();
            services.AddScoped<IUserDetailDal, EFUserDetailDal>();
            services.AddScoped<IUserLanguageService, UserLanguageManager>();
            services.AddScoped<IUserLanguageDal, EFUserLanguageDal>();
            services.AddScoped<IImageService, ImageManager>();
            services.AddScoped<IImageDal, EFImageDal>();
            services.AddScoped<IAlbomService, AlbomManager>();
            services.AddScoped<IAlbomDal, EFAlbomDal>();
            services.AddScoped<IRecycleBinService, RecycleBinManager>();
            services.AddScoped<IRecycleBinDal, EFRecycleBinDal>();
            services.AddScoped<IPostService, PostManager>();
            services.AddScoped<IPostDal, EFPostDal>();
            services.AddScoped<IPostImageService, PostImageManager>();
            services.AddScoped<IPostImageDal, EFPostImageDal>();
            services.AddScoped<ICommentService, CommentManager>();
            services.AddScoped<ICommentDal, EFCommentDal>();
            services.AddScoped<IPostLikeService, PostLikeManager>();
            services.AddScoped<IPostIsLikeDal, EFPostIsLikeDal>();
            services.AddScoped<ICommentLikeService, CommentLikeManager>();
            services.AddScoped<ICommentIsLikeDal, EFCommentIsLikeDal>();
            services.AddDbContext<MyIdentityDbContext>(options => options.UseSqlServer(Configuration["ConnectionStrings:Default"]));
            services.AddControllers();
            services.AddIdentity<AppUser, IdentityRole>(identityOptions =>
            {
                identityOptions.Password.RequireDigit = true;
                identityOptions.Password.RequiredLength = 6;
                identityOptions.Password.RequireNonAlphanumeric = false;
                identityOptions.Password.RequireUppercase = true;
                identityOptions.Lockout.MaxFailedAccessAttempts = 10;
                identityOptions.Lockout.AllowedForNewUsers = false;
                identityOptions.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(10);
                identityOptions.User.RequireUniqueEmail = true;
                identityOptions.SignIn.RequireConfirmedEmail = true;
            }).AddEntityFrameworkStores<MyIdentityDbContext>().AddDefaultTokenProviders();
           
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateAudience = true,
                    ValidateIssuer = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]))
                };

            });
           
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();
            app.UseCors(x => x
                .AllowAnyMethod()
                .AllowAnyHeader()
                .SetIsOriginAllowed(origin => true) 
                .AllowCredentials());

            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
