using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Status:IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public virtual ICollection<Friend> Friends { get; set; }
    }
}
