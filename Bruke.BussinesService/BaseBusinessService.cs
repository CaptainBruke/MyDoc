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
    public class BaseBusinessService<TEntity> : IBaseBusinessService<TEntity> where TEntity : BaseModel
    {
        private MyDocDbContext _dbContext;
        public BaseBusinessService(MyDocDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public Task<TEntity> FindAsync(Func<TEntity, bool> func)
        {
            var task = Task.Run(() => _dbContext.Set<TEntity>().AsQueryable<TEntity>().Where(func).FirstOrDefault());
            return task;
        }

        public Task<IEnumerable<TEntity>> FindListAsync(Func<TEntity, bool> func)
        {
            var task = Task.Run(() => _dbContext.Set<TEntity>().AsQueryable<TEntity>().Where(func));
            return task;
        }

        public Task<long> CountAsync<TOrderBy>(Func<TEntity, bool> func)
        {
            var task = Task.Run(() =>
            {
                var queryAble = _dbContext.Set<TEntity>().AsQueryable<TEntity>().Where(func);
                return queryAble.LongCount();
            });
            return task;
        }

        public Task<IEnumerable<TEntity>> GetPageListAsync<TOrderBy>(Func<TEntity, bool> func, Func<TEntity, TOrderBy> orderBy, int pageIndex, int pageSize, SortOrder sortOrder = SortOrder.Ascending)
        {
            var task = Task.Run(() =>
            {
                var queryAble = _dbContext.Set<TEntity>().AsQueryable<TEntity>().Where(func);
                if (sortOrder == SortOrder.Ascending)
                    queryAble.OrderBy(orderBy);
                else if (sortOrder == SortOrder.Descending)
                    queryAble.OrderByDescending(orderBy);

                return queryAble.Skip((pageIndex - 1) * pageSize).Take(pageSize);
            });
            return task;
        }

        public async Task<int> DeleteAsync(Func<TEntity, bool> func)
        {
            var models = _dbContext.Set<TEntity>().AsQueryable<TEntity>().Where(func);
            if (models != null)
            {
                _dbContext.Set<TEntity>().RemoveRange(models);
                return await _dbContext.SaveChangesAsync();
            }
            return 0;
        }
    }
}
