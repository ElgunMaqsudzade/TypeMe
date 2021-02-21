using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace TypemeApi.Models
{
    public class AppUser : IdentityUser
    {
        [Required]
        public string Name { get; set; }
        [Required]
        public string Surname { get; set; }
        [Required]
        public string Gender { get; set; }
        //[Required,DataType(DataType.DateTime)]
        //public DateTime BirthDay { get; set; }
        public string Image { get; set; }
        [NotMapped]
        public IFormFile Photo { get; set; }
        public bool IsDeleted { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? DeleteTime { get; set; }
        [DataType(DataType.DateTime)]
        public DateTime? UpdateTime { get; set; }
        [Required, DataType(DataType.DateTime)]
        public DateTime CreateTime { get; set; }
    }
}
