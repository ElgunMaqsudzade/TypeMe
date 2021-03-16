using Core.Entities;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Post:IEntity
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int? ViewCount { get; set; }
        public DateTime CreateTime { get; set; }
        //public int? ShareCount { get; set; }
        public List<PostImage> PostImages { get; set; }
        public List<Comment> Comments { get; set; }
        public string Username { get; set; }
    }
}
