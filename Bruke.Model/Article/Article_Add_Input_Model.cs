using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class Article_Add_Input_Model
    {
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
    }
}
