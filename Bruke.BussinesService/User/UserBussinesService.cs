using Bruke.Code;
using Bruke.EntityFrameWork;
using Bruke.IBusinessService;
using Bruke.Model;
using System;
using System.Text;
using System.Linq;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Security.Claims;

namespace Bruke.BusinessService
{
    public class UserBussinesService : BaseBusinessService<UserModel>, IUserBusinessService
    {

        private MyDocDbContext _dbContext;
        private readonly string passwordSalt = "Bruke";
        public UserBussinesService(MyDocDbContext dbContext) : base(dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// 获取当前Http的用户信息
        /// </summary>
        /// <param name="userClaims"></param>
        /// <returns></returns>
        public Task<UserIdentity> GetCurrent(IEnumerable<Claim> userClaims)
        {
            return Task.Run(() =>
            {
                UserIdentity user = null;
                if (userClaims == null || !userClaims.Any())
                    return user;

                user = new UserIdentity();
                var typeUser = user.GetType();
                foreach (var claim in userClaims)
                {
                    foreach (var property in typeUser.GetProperties())
                    {
                        if (property.Name == claim.Type.ToString())
                        {
                            switch (claim.ValueType)
                            {
                                case nameof(Int32):
                                    property.SetValue(user, Int32.Parse(claim.Value));
                                    break;
                                case nameof(DateTime):
                                    property.SetValue(user, DateTime.Parse(claim.Value));
                                    break;
                                default:
                                    property.SetValue(user, claim.Value);
                                    break;
                            }
                            break;
                        }
                    }
                }
                return user;
            });
        }


        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="register"></param>
        /// <returns></returns>
        public async Task<AjaxResult> RegisterAsync(User_Register_Input_Model register)
        {
            var ajaxResult = new AjaxResult();
            if (_dbContext.users.Any(w => w.account == register.account))
            {
                ajaxResult.status = ResultType.warning;
                ajaxResult.message = "登录名称已存在！";
                return ajaxResult;
            }
            if (_dbContext.users.Any(w => w.phone == register.phone))
            {
                ajaxResult.status = ResultType.warning;
                ajaxResult.message = "手机号码已存在！";
                return ajaxResult;
            }
            var password = await GetCiphertextAsync(register.password, passwordSalt);
            await _dbContext.users.AddAsync(new UserModel
            {
                name = register.name,
                phone = register.phone,
                account = register.account,
                password = password,
                registerTime = DateTime.Now
            });
            var res = await _dbContext.SaveChangesAsync();
            if (res > 0)
                ajaxResult.message = "注册成功！";
            else
            {
                ajaxResult.status = ResultType.error;
                ajaxResult.message = "注册失败！";
            }
            return ajaxResult;
        }


        Task<AjaxResult> IUserBusinessService.ResetPassword(User_Reset_Password_Input_Model input, UserIdentity user)
        {
            throw new NotImplementedException();
        }


        /// <summary>
        /// 获取加盐MD5
        /// </summary>
        /// <param name="password"></param>
        /// <param name="salt"></param>
        /// <returns></returns>
        public Task<string> GetCiphertextAsync(string password, string salt = null)
        {
            return Task.Run(() =>
            {
                var ciphertext = string.Empty;
                if (!string.IsNullOrWhiteSpace(password))
                {
                    ciphertext = SecurityHelper.MD5Encrypt(password, Encoding.UTF8);
                    if (!string.IsNullOrWhiteSpace(salt))
                        ciphertext = SecurityHelper.MD5Encrypt(password + salt, Encoding.UTF8);
                }
                return ciphertext;
            });
        }

    }
}
