using AutoMapper;
using Bruke.EntityFrameWork;
using Bruke.IBusinessService;
using Bruke.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Bruke.BusinessService
{
    /// <summary>
    /// 笔记业务服务
    /// </summary>
    public class ArticleBusinessService : BaseBusinessService<ArticleModel>, IArticleBusinessService
    {
        private MyDocDbContext _dbContext;
        private readonly IMapper _mapper;
        public ArticleBusinessService(MyDocDbContext dbContext,
            IMapper mapper

            ) : base(dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
        }

        public async Task<AjaxResult> AddAsync(Article_Add_Input_Model model, UserIdentity user)
        {
            var dbModel = _mapper.Map<ArticleModel>(model);
            dbModel.user_id = user.UserId;
            dbModel.content = dbModel.content ?? string.Empty;
            dbModel.create_date_time = dbModel.update_date_time = DateTime.Now;
            var insertOut = await _dbContext.articles.AddAsync(dbModel);
            if ((await _dbContext.SaveChangesAsync()) > 0)
                return new AjaxResult()
                {
                    data = new Article_Add_Output_Model
                    {
                        id = insertOut.Entity.id,
                        title = insertOut.Entity.title,
                        book_id = insertOut.Entity.book_id
                    }
                };
            else
                return new AjaxResult() { status = ResultType.error, message = "添加失败" };
        }

        public async Task<AjaxResult> DeleteAsync(int id, UserIdentity user)
        {
            var result = await DeleteAsync(w => w.id == id && w.user_id == user.UserId);
            if (result > 0)
                return new AjaxResult();
            else
                return new AjaxResult() { status = ResultType.warning, message = "删除失败" };
        }

        public async Task<AjaxResult> EditAsync(Article_Edit_Input_Model model, UserIdentity user)
        {
            var dbModel = await FindAsync(w => w.id == model.id && w.user_id == user.UserId);
            dbModel.title = model.title;
            dbModel.content = model.content;
            dbModel.update_date_time = DateTime.Now;
            if ((await _dbContext.SaveChangesAsync()) > 0)
                return new AjaxResult();
            else
                return new AjaxResult() { status = ResultType.warning, message = "编辑失败" };
        }

        public async Task<AjaxResult> GetAsync(int id, UserIdentity user)
        {
            var dbModel = await FindAsync(w => w.id == id && w.user_id == user.UserId);
            return new AjaxResult() { data = dbModel };
        }
    }
}
