using Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Entity.Entities
{
    public class Student:IEntity
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
