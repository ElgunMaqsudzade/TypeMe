using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Albom
{
    public class SaveImage
    {
        public string Username { get; set; }
        public IFormFile Photo { get; set; }
        public int? AlbumId { get; set; }
    }
}
