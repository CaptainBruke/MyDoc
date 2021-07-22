using Bruke.IBusinessService;
using Bruke.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MyDoc.Controllers
{
    [Authorize]
    public class BookController : Controller
    {

        private readonly IHttpContextAccessor _httpContextAccessor;
        private IBookBusinessService _bookBusinessService;
        private IUserBusinessService _userBusinessService;
        public BookController(
        IHttpContextAccessor httpContextAccessor,
        IBookBusinessService bookBusinessService,
        IUserBusinessService userBusinessService)
        {
            _httpContextAccessor = httpContextAccessor;
            _bookBusinessService = bookBusinessService;
            _userBusinessService = userBusinessService;
        }
        public async Task<IActionResult> GetBookTree()
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _bookBusinessService.GetBookTreeAsync(user);
            return Json(result);
        }

        public async Task<IActionResult> Get(int id)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _bookBusinessService.GetAsync(id, user);
            return Json(result);
        }

        public async Task<IActionResult> Add(Book_Add_Input_Model input)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _bookBusinessService.AddAsync(input, user);
            return Json(result);
        }


        public async Task<IActionResult> Delete(int id)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _bookBusinessService.DeleteAsync(id, user);
            return Json(result);
        }

        public async Task<IActionResult> Edit(Book_Edit_Input_Model input)
        {
            var user = await _userBusinessService.GetCurrent(_httpContextAccessor.HttpContext.User.Claims);
            var result = await _bookBusinessService.EditAsync(input, user);
            return Json(result);
        }
    }
}
