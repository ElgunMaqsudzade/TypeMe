using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Settings
{
    public class ChangePassword
    {
        public string Username { get; set; }
        public string Oldpassword { get; set; }
        public string Newpassword { get; set; }
    }
}
