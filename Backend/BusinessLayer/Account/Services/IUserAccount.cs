using BusinessLayer.Account.DTO;
using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Account.Services
{
    public interface IUserAccount
    {
        Task<IEnumerable<User>> GetAllAvailableUsers();
        Task<AuthModel> Register(UserRegisterDTO model);
        Task<AuthModel> Login(LoginDTO model);
        //Task<bool> ChangePassword(string username, string currentPassword, string newPassword);
        //Task<bool> ResetPassword(string email);

        Task<ResultDto> Edit(EditPRofileDTO model);
        Task<ResultDto> ConfirmEmail(int? userID , string code);
        Task<ResultDto> ForgetPassword(string email);
        Task<ResultDto> RestetPassword(ResetPasswordDTO model);
        Task<ResultDto> GetUser(int id);

    }
}
