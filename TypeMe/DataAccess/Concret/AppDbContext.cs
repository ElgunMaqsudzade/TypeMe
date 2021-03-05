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
            optionsBuilder.UseSqlServer("Data Source=SQL5080.site4now.net;Initial Catalog=DB_A709F1_elgun4000;User Id=DB_A709F1_elgun4000_admin;Password=salam123");
        }
        public DbSet<Status> Statuses { get; set; }
        public DbSet<Friend> Friends { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<UserLanguage> UserLanguages { get; set; }
        public DbSet<Albom> Alboms { get; set; }
        public DbSet<Image> Images { get; set; }

    }
}
