using Entity.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.Identity;

namespace TypeMeApi.DAL
{
    public class MyIdentityDbContext : IdentityDbContext<AppUser>
    {
        public MyIdentityDbContext(DbContextOptions<MyIdentityDbContext> options) : base(options)
        {

        }
        public DbSet<AppUser> AppUsers { get; set; }
    }
}
