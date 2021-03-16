using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TypeMeApi.ToDoItems.Albom
{
    public class Alboms
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Cover { get; set; }
        public List<Images> Images { get; set; }
    }
}
