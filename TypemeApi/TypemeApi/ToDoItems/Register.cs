using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace TypemeApi.ToDoItems
{
    public class Register
    {
        [Required(ErrorMessage = "Please enter your first and last name."), StringLength(30, ErrorMessage = "The maximum number of letters in this cell is 30")]
        public string Name { get; set; }
        [Required(ErrorMessage = "Please choose your gender.")]
        public string Gender { get; set; }
        //[Required(ErrorMessage = "Please choose your birthday.")]
        //public DateTime Birthday { get; set; }
        [Required(ErrorMessage = "Please enter your first and last name."), StringLength(30, ErrorMessage = "The maximum number of letters in this cell is 30")]
        public string Surname { get; set; }
        [Required(ErrorMessage = "Please enter your email address."), DataType(DataType.EmailAddress, ErrorMessage = "Email format is not correct")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Please enter password for the account."), DataType(DataType.Password, ErrorMessage = "Password format is not correct")]
        [RegularExpression(@"^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).{6,15}$", ErrorMessage = "The number of letters in this cell must be greater than 6, less than 15, at least 1 digit and uppercase")]
        public string Password { get; set; }
        [Required(ErrorMessage = "Please re-enter password for the account."), DataType(DataType.Password, ErrorMessage = "Password format is not correct"), Compare(nameof(Password), ErrorMessage = "Passwords doesn't match.")]
        public string CheckPassword { get; set; }
    }
}
