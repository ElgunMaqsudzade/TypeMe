using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class PostImage: IEntity
    {
        public int Id { get; set; }
        public int ImageId { get; set; }
        public Image Image { get; set; }
        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}
