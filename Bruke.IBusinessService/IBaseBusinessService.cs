using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;
using Bruke.Model;

namespace Bruke.IBusinessService
{
    public interface IBaseBusinessService<TEntity> where TEntity : BaseModel
    {
        /// <summary>
        /// 获取一个实体
        /// </summary>
        /// <param name="func"></param>
        /// <returns></returns>
        Task<TEntity> FindAsync(Expression<Func<TEntity, bool>> func);

        /// <summary>
        /// 获取实体集合
        /// </summary>
        /// <param name="func"></param>
        /// <returns></returns>
        Task<IQueryable<TEntity>> FindListAsync(Expression<Func<TEntity, bool>> func);

        /// <summary>
        /// 获取总数
        /// </summary>
        /// <typeparam name="TOrderBy"></typeparam>
        /// <param name="func"></param>
        /// <returns></returns>
        Task<long> CountAsync<TOrderBy>(Expression<Func<TEntity, bool>> func);

        /// <summary>
        /// 获取分页
        /// </summary>
        /// <typeparam name="TOrderBy"></typeparam>
        /// <param name="func"></param>
        /// <param name="orderBy"></param>
        /// <param name="pageIndex"></param>
        /// <param name="pageSize"></param>
        /// <param name="sortOrder"></param>
        /// <returns></returns>
        Task<IQueryable<TEntity>> GetPageListAsync<TOrderBy>(Expression<Func<TEntity, bool>> func, Expression<Func<TEntity, TOrderBy>> orderBy, int pageIndex, int pageSize, SortOrder sortOrder = SortOrder.Ascending);

        /// <summary>
        /// 删除一批实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<int> DeleteAsync(Expression<Func<TEntity, bool>> func);
    }

    /// <summary>
    /// 排序:正序、倒叙
    /// </summary>
    public enum SortOrder {
        Ascending,
        Descending
    }
}
