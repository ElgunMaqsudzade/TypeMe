using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Albom:IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string AppUserId { get; set; }
        public AppUser AppUser { get; set; }
        public virtual ICollection<Image> Images { get; set; }
    }
}
