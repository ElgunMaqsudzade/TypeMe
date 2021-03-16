using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Post
{
    public class CreateComment
    {
        public int Postid { get; set; }
        public string Username { get; set; }
        public int? Parentid { get; set; }
        public int? Replyid { get; set; }
        public string Description { get; set; }
    }
}
