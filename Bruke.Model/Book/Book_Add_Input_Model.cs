using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class Book_Add_Input_Model
    {
        /// <summary>
        /// 笔记本名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 父级id
        /// </summary>
        public int parent_id { get; set; }
    }
}
