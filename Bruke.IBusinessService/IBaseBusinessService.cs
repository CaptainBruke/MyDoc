using System;
using System.Collections.Generic;
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
        Task<TEntity> FindAsync(Func<TEntity, bool> func);

        /// <summary>
        /// 获取实体集合
        /// </summary>
        /// <param name="func"></param>
        /// <returns></returns>
        Task<IEnumerable<TEntity>> FindListAsync(Func<TEntity, bool> func);

        /// <summary>
        /// 获取总数
        /// </summary>
        /// <typeparam name="TOrderBy"></typeparam>
        /// <param name="func"></param>
        /// <returns></returns>
        Task<long> CountAsync<TOrderBy>(Func<TEntity, bool> func);

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
        Task<IEnumerable<TEntity>> GetPageListAsync<TOrderBy>(Func<TEntity, bool> func, Func<TEntity, TOrderBy> orderBy, int pageIndex, int pageSize, SortOrder sortOrder = SortOrder.Ascending);

        /// <summary>
        /// 删除一批实体
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        Task<int> DeleteAsync(Func<TEntity, bool> func);
    }

    /// <summary>
    /// 排序:正序、倒叙
    /// </summary>
    public enum SortOrder {
        Ascending,
        Descending
    }
}
