using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class PostIsLike:IEntity
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int PostId { get; set; }
    }
}
