using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class UserLanguage : IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<UserDetail> UserDetails { get; set; }
    }
}
