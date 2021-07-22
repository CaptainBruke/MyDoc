using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class UserModel : BaseModel
    {
        public int id { get; set; }

        /// <summary>
        /// 用户真实姓名
        /// </summary>
        public string name { get; set; }

        /// <summary>
        /// 登录名
        /// </summary>
        public string account { get; set; }

        /// <summary>
        /// 手机(可用于登录)
        /// </summary>
        public string phone { get; set; }

        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }

        /// <summary>
        /// 注册时间
        /// </summary>
        public DateTime registerTime { get; set; }

        /// <summary>
        /// 最近登录时间
        /// </summary>
        public DateTime lastLoginTime { get; set; }

    }
}
