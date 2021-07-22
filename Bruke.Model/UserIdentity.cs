using System;

namespace Bruke.Model
{
    public class UserIdentity
    {
        public int UserId { get; set; }

        /// <summary>
        /// 用户真实姓名
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// 登录名
        /// </summary>
        public string Account { get; set; }

        /// <summary>
        /// 手机(可用于登录)
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 登录IP地址
        /// </summary>
        public string LoginIPAddress { get; set; }
        /// <summary>
        /// 登录IP地址名称
        /// </summary>
        public string LoginIPAddressName { get; set; }
        /// <summary>
        /// 登录时间
        /// </summary>
        public DateTime LoginTime { get; set; }

    }
}
