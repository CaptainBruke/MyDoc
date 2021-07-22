using Bruke.Model;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Bruke.IBusinessService
{
    public interface IUserBusinessService: IBaseBusinessService<UserModel>
    {
        /// <summary>
        /// 获取用户cookie信息
        /// </summary>
        /// <returns></returns>
        Task<UserIdentity> GetCurrent(IEnumerable<Claim> userClaims);


        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="register"></param>
        /// <returns></returns>
        Task<AjaxResult> RegisterAsync(User_Register_Input_Model register);

        /// <summary>
        /// 重置密码
        /// </summary>
        /// <param name="input"></param>
        /// <param name="user"></param>
        /// <returns></returns>
        Task<AjaxResult> ResetPassword(User_Reset_Password_Input_Model input, UserIdentity user);

        /// <summary>
        /// 获取加密字符串
        /// </summary>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        Task<string> GetCiphertextAsync(string password, string salt = null);
    }
}
