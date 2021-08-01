using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using Bruke.EntityFrameWork;
using Bruke.IBusinessService;
using Bruke.Model;

namespace Bruke.BusinessService
{
    public class BookBusinessService : BaseBusinessService<BookModel>, IBookBusinessService
    {
        private MyDocDbContext _dbContext;
        private readonly IMapper _mapper;
        IArticleBusinessService _articleBusinessService;
        public BookBusinessService(MyDocDbContext dbContext,
            IMapper mapper,
            IArticleBusinessService articleBusinessService

            ) : base(dbContext)
        {
            _mapper = mapper;
            _dbContext = dbContext;
            _articleBusinessService = articleBusinessService;
        }

        public async Task<AjaxResult> AddAsync(Book_Add_Input_Model model, UserIdentity user)
        {
            if (_dbContext.books.Any(a => a.name == model.name && a.user_id == user.UserId))
            {
                return new AjaxResult() { status = ResultType.error, message = "已存在同名的笔记本" };
            }

            var dbModel = _mapper.Map<BookModel>(model);
            dbModel.user_id = user.UserId;
            dbModel.create_date_time = dbModel.update_date_time = DateTime.Now;
            await _dbContext.books.AddAsync(dbModel);
            if ((await _dbContext.SaveChangesAsync()) > 0)
            {
                dbModel.path = $"/{dbModel.parent_id}/{dbModel.id}";
                await _dbContext.SaveChangesAsync();
                return new AjaxResult();
            }
            else
                return new AjaxResult() { status = ResultType.error, message = "添加失败" };
        }

        public async Task<AjaxResult> DeleteAsync(int id, UserIdentity user)
        {
            if (_dbContext.books.Any(a => a.parent_id == id && a.user_id == user.UserId))
            {
                return new AjaxResult() { status = ResultType.error, message = "存在子级的笔记本,请先删除子级笔记本" };
            }

            if (_dbContext.articles.Any(a => a.book_id == id && a.user_id == user.UserId))
            {
                return new AjaxResult() { status = ResultType.error, message = "存在子级的笔记,请先删除子级笔记" };
            }


            var result = await DeleteAsync(w => w.id == id && w.user_id == user.UserId);
            if (result > 0)
                return new AjaxResult();
            else
                return new AjaxResult() { status = ResultType.warning, message = "删除失败" };
        }

        public async Task<AjaxResult> EditAsync(Book_Edit_Input_Model model, UserIdentity user)
        {
            var dbModel = await FindAsync(w => w.id == model.id && w.user_id == user.UserId);
            dbModel.name = model.name;
            dbModel.parent_id = model.parent_id;
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

        public async Task<List<Book_Tree_Output_Model>> GetBookTreeAsync(UserIdentity user, string searchKey)
        {
            var books = (await FindListAsync(w => w.user_id == user.UserId))
                .OrderBy(o => o.name)
                .Select(s => new
                {
                    s.id,
                    s.name,
                    s.parent_id
                })
                .ToList();

            var articles = (await _articleBusinessService.FindListAsync(w => w.user_id == user.UserId))
            .OrderByDescending(o => o.create_date_time)
            .Select(s => new
            {
                s.id,
                s.title,
                s.book_id
            })
            .ToList();

            //这里应该去查数据库，不应该在内存上操作。因为上面的条件，我还没封装，用不了
            if (!string.IsNullOrWhiteSpace(searchKey))
                articles = articles.Where(w => w.title.ToUpper().Contains(searchKey.ToUpper())).ToList();

            var bookTrees = new List<Book_Tree_Output_Model>();
            //一级目录
            foreach (var book in books.Where(w => w.parent_id == 0))
            {
                var bookTree = new Book_Tree_Output_Model
                {
                    id = book.id,
                    name = book.name,
                    type = BookTreeType.Book1,
                    children = new List<Book_Tree_Output_Model>()
                };
                //二级级目录
                foreach (var secondBook in books.Where(w => w.parent_id == book.id))
                {

                    var secondBookTree = new Book_Tree_Output_Model
                    {
                        id = secondBook.id,
                        name = secondBook.name,
                        type = BookTreeType.Book2,
                        children = new List<Book_Tree_Output_Model>()

                    };
                    //二级目录的文章
                    foreach (var secondArticle in articles.Where(w => w.book_id == secondBook.id))
                    {
                        secondBookTree.children.Add(new Book_Tree_Output_Model()
                        {
                            id = secondArticle.id,
                            name = secondArticle.title,
                            type = BookTreeType.Article
                        });
                    }
                    //搜索的时候，移除没有文章的目录
                    if (string.IsNullOrWhiteSpace(searchKey)||(!string.IsNullOrWhiteSpace(searchKey)&& secondBookTree.children.Count>0))
                        bookTree.children.Add(secondBookTree);
                }

                //一级目录的文章
                foreach (var article in articles.Where(w => w.book_id == book.id))
                {
                    bookTree.children.Add(new Book_Tree_Output_Model()
                    {
                        id = article.id,
                        name = article.title,
                        type = BookTreeType.Article
                    });
                }

                //搜索的时候，移除没有文章的目录
                if (string.IsNullOrWhiteSpace(searchKey) || (!string.IsNullOrWhiteSpace(searchKey) && bookTree.children.Count > 0))
                    bookTrees.Add(bookTree);
            }

            return bookTrees;
        }

    }
}
