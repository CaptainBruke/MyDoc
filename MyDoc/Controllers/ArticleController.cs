using Bruke.IBusinessService;
using Bruke.Model;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyDoc.Controllers
{
    public class ArticleController : Controller
    {
        private IUserBusinessService _userBusinessService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IArticleBusinessService _articleBusinessService;
        public ArticleController(IUserBusinessService userBusinessService,
        IHttpContextAccessor httpContextAccessor,
        IArticleBusinessService articleBusinessService)
        {
            _userBusinessService = userBusinessService;
            _httpContextAccessor = httpContextAccessor;
            _articleBusinessService = articleBusinessService;
        }

        public async Task<IActionResult> Get(int id)
        {
           var user= await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _articleBusinessService.GetAsync(id, user);
            return Json(result);
        }

        public async Task<IActionResult> Add(Article_Add_Input_Model input)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _articleBusinessService.AddAsync(input, user);
            return Json(result);
        }

        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _articleBusinessService.DeleteAsync(id, user);
            return Json(result);
        }

        public async Task<IActionResult> Edit(Article_Edit_Input_Model input)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _articleBusinessService.EditAsync(input, user);
            return Json(result);
        }
    }
}
