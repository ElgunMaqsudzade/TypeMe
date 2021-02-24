using Core.Repository.EFRepository;
using Entity.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace DataAccess.Abstract.Concret
{
    public class EFStudentDAL : EFEntityRepositoryBase<Student, AppDbContext>, IStudentDAL
    {

    }
}
