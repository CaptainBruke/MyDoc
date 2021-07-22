using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class TemplateModel : BaseModel
    {
        public int id { get; set; }
        /// <summary>
        /// 模板名称
        /// </summary>
        public string name { get; set; }
        /// <summary>
        /// 模板内容
        /// </summary>
        public string content { get; set; }
        /// <summary>
        /// 模板拥有者id
        /// </summary>
        public int user_id { get; set; }
    }
}
