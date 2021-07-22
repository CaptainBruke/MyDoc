using System;

namespace Bruke.Model
{
    public class ArticleDTO
    {
        public int id { get; set; }
        /// <summary>
        /// 标题
        /// </summary>
        public string title { get; set; }
        /// <summary>
        /// 内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 笔记本id
        /// </summary>
        public int book_id { get; set; }
        /// <summary>
        /// 用户id
        /// </summary>
        public int user_id { get; set; }
        /// <summary>
        /// 创建时间
        /// </summary>
        public DateTime create_date_time { get; set; }
        /// <summary>
        /// 修改时间
        /// </summary>
        public DateTime update_date_time { get; set; }

    }
}
