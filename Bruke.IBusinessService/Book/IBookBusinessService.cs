using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using Bruke.Model;

namespace Bruke.IBusinessService
{
    public interface IBookBusinessService:IBaseBusinessService<BookModel>
    {
        Task<AjaxResult> AddAsync(Book_Add_Input_Model model, UserIdentity user);
        Task<AjaxResult> DeleteAsync(int id, UserIdentity user);
        Task<AjaxResult> EditAsync(Book_Edit_Input_Model model, UserIdentity user);
        Task<AjaxResult> GetAsync(int id, UserIdentity user);
        Task<List<Book_Tree_Output_Model>> GetBookTreeAsync(UserIdentity user);
    }
}
