using Entity.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Abstract.Concret
{
    public class AppDbContext:IdentityDbContext<AppUser>
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(@"Data Source = SQL5102.site4now.net; Initial Catalog = DB_A6F35F_jrcomerun; User Id = DB_A6F35F_jrcomerun_admin; Password = Lene1234");
        }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<UserLanguage> UserLanguages { get; set; }

    }
}
