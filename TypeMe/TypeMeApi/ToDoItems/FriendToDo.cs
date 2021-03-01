using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems
{
    public class FriendToDo
    {
        public string Email { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Status { get; set; }
        public bool IsFromUser { get; set; }
    }
}
