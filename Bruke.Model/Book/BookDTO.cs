using System;

namespace Bruke.Model
{
    public class BookDTO
    {
        public int id { get; set; }
        /// <summary>
        /// 笔记本名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 父级id
        /// </summary>
        public int parent_id { get; set; }
        /// <summary>
        /// 笔记本路径
        /// </summary>
        public string path { get; set; }
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
