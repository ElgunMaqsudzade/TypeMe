using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Image:IEntity
    {
        public int Id { get; set; }
        public string Link { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public int? AlbomId { get; set; }
        public Albom Albom { get; set; }
        public List<PostImage> PostImages { get; set; }
    }
}
