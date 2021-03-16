using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    
    public class CommentIsLike : IEntity
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public int CommentId { get; set; }
    }
}
