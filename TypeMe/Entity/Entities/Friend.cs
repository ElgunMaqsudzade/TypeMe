using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Friend:IEntity
    {
        public int Id { get; set; }
        public string FromUserName { get; set; }
        public string ToUserName { get; set; }
        public int StatusId { get; set; }
        public Status Status { get; set; }
    }
}