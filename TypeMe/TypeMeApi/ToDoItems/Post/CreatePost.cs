using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Post
{
    public class CreatePost
    {
        public string Username { get; set; }
        public string Description { get; set; }
        public List<int?> Imageids { get; set; }
    }
}
