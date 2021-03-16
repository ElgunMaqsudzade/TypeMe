using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Comment:IEntity
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public string UserName { get; set; }
        public int? ParentId { get; set; }
        public int? ReplyTo { get; set; }
        public DateTime CreateTime { get; set; }
        public int? PostId { get; set; }
        public Post Post { get; set; }
    }
}
