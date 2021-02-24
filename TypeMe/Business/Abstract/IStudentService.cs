using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Abstract
{
    public interface IStudentService
    {
        Student GetStuwithId(int id);
        List<Student> GetStudents();
        void Add(Student student);
        void Update(Student student);
        void Delete(int id);
    }
}
