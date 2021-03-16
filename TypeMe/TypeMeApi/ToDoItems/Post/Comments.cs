using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Post
{
    public class Comments
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public int? Likes { get; set; }
        public PostUser User { get; set; }
        public int Childcommentscount { get; set; }
        public bool Islike { get; set; }
        public DateTime Createtime { get; set; }
    }
}
