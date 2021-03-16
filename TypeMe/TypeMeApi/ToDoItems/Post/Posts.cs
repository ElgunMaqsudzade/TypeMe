using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using TypeMeApi.ToDoItems.Albom;

namespace TypeMeApi.ToDoItems.Post
{
    public class Posts
    {
        public int Id { get; set; }
        public PostUser User { get; set; }
        public string Description { get; set; }
        public List<Images> Images { get; set; }
        public int Commentscount { get; set; }
        public DateTime Createtime { get; set; }
        public int Likes { get; set; }
        public int Views { get; set; }
        public bool Islike { get; set; }

    }
}
