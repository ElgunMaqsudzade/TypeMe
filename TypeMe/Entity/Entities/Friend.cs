using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Friend:IEntity
    {
        public int Id { get; set; }
        public string From { get; set; }
        public string To { get; set; }
        public int StatusId { get; set; }
        public virtual Status Status { get; set; }
    }
}