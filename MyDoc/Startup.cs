using AutoMapper;
using Bruke.BusinessService;
using Bruke.Code;
using Bruke.EntityFrameWork;
using Bruke.IBusinessService;
using Bruke.Model;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using UEditor.Core;

namespace MyDoc
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddSession();
            services.AddControllersWithViews()
                .AddRazorRuntimeCompilation();


            ////设置身份验证服务
            services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
                .AddCookie(option =>
                {
                    //option.Cookie.Domain = Configuration.GetSection("CookieDomain").Value;
                    option.LoginPath = "/User/Login/?ReturnUrl=/";
                    //option.Cookie.HttpOnly = true;
                });

            services.AddOptions();


            services.AddAutoMapper(typeof(AutoMapperConfig).Assembly);
            services.AddScoped<IMapper, Mapper>();

            //数据库连接
            services.AddDbContext<MyDocDbContext>(options =>
                //options.UseMySql(ServerVersion.AutoDetect(Configuration.GetConnectionString("mydoc"))));
                options.UseMySql(Configuration.GetConnectionString("mydoc"), ServerVersion.AutoDetect(Configuration.GetConnectionString("mydoc"))));

            //百度编辑器后端服务
            services.AddUEditorService();

            //批量注册服务
            //var dics = InterfaceBaseHelper.GetClassName("Bruke.BusinessService", t => t.Name.Contains("Service") && !t.IsInterface);
            //foreach (var dic in dics)
            //{
            //    //dic  实现：接口集合
            //    foreach (var Itype in dic.Value)
            //        services.AddScoped(Itype, dic.Key);//接口:实现
            //}

            //服务注册
            services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
            services.AddScoped(typeof(IBaseBusinessService<>), typeof(BaseBusinessService<>));
            services.AddScoped(typeof(IUserBusinessService), typeof(UserBussinesService));
            services.AddScoped(typeof(IArticleBusinessService), typeof(ArticleBusinessService));
            services.AddScoped(typeof(IBookBusinessService), typeof(BookBusinessService));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseSession();
            app.UseHttpsRedirection();

            app.UseStaticFiles();
            app.UseStaticFiles("/upload");

            app.UseRouting();
            app.UseAuthentication();
            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
