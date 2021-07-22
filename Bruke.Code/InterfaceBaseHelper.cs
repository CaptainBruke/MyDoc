using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Bruke.Code
{
    /// <summary>
    /// 接口实现帮助类
    /// </summary>
    public class InterfaceBaseHelper
    {
        /// <summary>
        /// 获取实现类型的接口类型集合
        /// </summary>
        /// <param name="assemblyName"></param>
        /// <param name="func"></param>
        /// <returns></returns>
        public static Dictionary<Type, Type[]> GetClassName(string assemblyName, Func<Type, bool> func = null)
        {
            var assembly = Assembly.Load(assemblyName);
            var types = assembly.GetTypes().ToList();
            if (func != null)
                types = types.Where(func).ToList();
            var result = new Dictionary<Type, Type[]>();
            foreach (var item in types)
            {
                var interfaceTypes = item.GetInterfaces();
                result.Add(item, interfaceTypes);
            }
            return result;

        }
    }
}
