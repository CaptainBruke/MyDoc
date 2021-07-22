using Bruke.Model;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace Bruke.IBusinessService
{
    public interface IArticleBusinessService : IBaseBusinessService<ArticleModel>
    {
        Task<AjaxResult> AddAsync(Article_Add_Input_Model model,UserIdentity user);
        Task<AjaxResult> DeleteAsync(int id,UserIdentity user);
        Task<AjaxResult> EditAsync(Article_Edit_Input_Model model,UserIdentity user);
        Task<AjaxResult> GetAsync(int id,UserIdentity user);

    }
}
