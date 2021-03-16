using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Post
{
    public class ReplyComment
    {
        public int Id { get; set; }
        public int? Likes { get; set; }
        public int? Parentid { get; set; }
        public int? Replyid { get; set; }
        public string Description { get; set; }
        public PostUser User { get; set; }
        public DateTime Createtime { get; set; }
        public bool Islike { get; set; }
    }
}
