using Entity.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Abstract.Concret
{
    public class AppDbContext:DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer(@"Data Source = SQL5102.site4now.net; Initial Catalog = DB_A6F35F_jrcomerun; User Id = DB_A6F35F_jrcomerun_admin; Password = Lene1234");
        }
        public DbSet<Student> Students { get; set; }
        
    }
}
