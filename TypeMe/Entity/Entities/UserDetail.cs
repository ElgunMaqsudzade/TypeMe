using Core.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text;

namespace Entity.Entities
{
    public class UserDetail:IEntity
    {
        public int Id { get; set; }
        public string StatusMessage { get; set; }
        [ForeignKey("AppUser")]
        public string AppUserId { get; set; }
        public virtual AppUser AppUser { get; set; }
        public int? UserLanguageId { get; set; }
        public UserLanguage UserLanguage { get; set; }
    }
}
