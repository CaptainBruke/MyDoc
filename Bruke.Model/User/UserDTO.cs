
namespace Bruke.Model
{
    public class UserDTO
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
    }
}
