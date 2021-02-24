using Business.Abstract;
using DataAccess.Abstract;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace Business.Concret
{
    public class StudentManager : IStudentService
    {

        private readonly IStudentDAL _studentDal;
        public StudentManager(IStudentDAL studentDal)
        {
            _studentDal = studentDal;
        }
        public List<Student> GetStudents()
        {
            return _studentDal.GetAll();
        }

        public Student GetStuwithId(int id)
        {
            return _studentDal.Get(s => s.Id == id);
        }
        public void Add(Student student)
        {
             _studentDal.Add(student);
        }

        public void Update(Student student)
        {
            _studentDal.Add(student);
        }
        public void Delete(int id)
        {
            _studentDal.Delete(new Student { Id = id });
        }

       

        
    }
}
