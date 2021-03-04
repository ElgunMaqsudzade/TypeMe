using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Profile
{
    public class GetFriendProfile
    {
        public string Email { get; set; }
        public string Image { get; set; }
        public string Name { get; set; }
        public string Surname { get; set; }
        public string Username { get; set; }
        public string Gender { get; set; }
        public DateTime Birthday { get; set; }
    }
}
