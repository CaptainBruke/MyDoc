using Bruke.IBusinessService;
using Bruke.Model;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace MyDoc.Controllers
{
    [Authorize]
    public class UserController : Controller
    {
        private IUserBusinessService _userBusinessService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public UserController(IUserBusinessService userBusinessService,
        IHttpContextAccessor httpContextAccessor)
        {
            _userBusinessService = userBusinessService;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// 注册
        /// </summary>
        /// <param name="inputModel"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Register(User_Register_Input_Model inputModel)
        {
            var result = await _userBusinessService.RegisterAsync(inputModel);
            return Json(result);
        }

        [AllowAnonymous]
        public IActionResult Login()
        {
            return View();
        }

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="inputModel"></param>
        /// <returns></returns>
        [AllowAnonymous]
        [HttpPost]
        public async Task<IActionResult> Login(User_Login_Input_Model inputModel)
        {
            var result = new AjaxResult();
            var password = await _userBusinessService.GetCiphertextAsync(inputModel.password, "Bruke");
            var user = await _userBusinessService
                    .FindAsync(w => (w.account == inputModel.account || w.phone == inputModel.account)
                                    && w.password == password);
            if (user == null)
            {
                result.status = ResultType.warning;
                result.message = "账号或密码不正确!";
                return Json(result);
            }

            var userIdentity = new UserIdentity()
            {
                UserId = user.id,
                Name = user.name,
                Account = user.account,
                Phone = user.phone,
                LoginIPAddress = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                LoginIPAddressName = _httpContextAccessor.HttpContext.Connection.RemoteIpAddress.ToString(),
                LoginTime = DateTime.Now
            };
            var claims = new List<Claim>
            {
                new Claim("UserId", userIdentity.UserId.ToString(),nameof(Int32)),
                new Claim("Name", userIdentity.Name),
                new Claim("Account", userIdentity.Account),
                new Claim("Phone", userIdentity.Phone),
                new Claim("LoginIPAddress", userIdentity.LoginIPAddress),
                new Claim("LoginIPAddressName", userIdentity.LoginIPAddressName),
                new Claim("LoginTime" , userIdentity.LoginTime.ToString(),nameof(DateTime))
            };
            ClaimsPrincipal claimsUser = new ClaimsPrincipal(new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme));

            await _httpContextAccessor.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsUser, new AuthenticationProperties()
            {
                ExpiresUtc = DateTimeOffset.UtcNow.AddMonths(1),
                AllowRefresh = true
            });
            return Json(result);
        }

        /// <summary>
        /// 获取当前用户
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous]
        public async Task<IActionResult> GetCurrent()
        {
            var userIdentity = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            return Json(userIdentity);
        }

        /// <summary>
        /// 退出登录
        /// </summary>
        /// <returns></returns>
        public async Task<IActionResult> LogOut()
        {
            await _httpContextAccessor.HttpContext.SignOutAsync();
            return Json(new AjaxResult() { message = "已退出" });
        }
    }
}
