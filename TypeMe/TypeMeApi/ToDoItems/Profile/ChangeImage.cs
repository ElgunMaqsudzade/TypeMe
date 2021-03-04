using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Profile
{
    public class ChangeImage
    {
        public string Username { get; set; }
        public IFormFile Photo { get; set; }
    }
}
