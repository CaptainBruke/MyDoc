using Bruke.EntityFrameWork;
using Bruke.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;

namespace Bruke.EntityFrameWork
{
    public class MyDocDbContext: DbContext
    {
        public MyDocDbContext(DbContextOptions<MyDocDbContext> options) : base(options)
        {
        }
        public IConfiguration Configuration { get; set; }

        #region 表实体
        public DbSet<ArticleModel> articles { get; set; }
        public DbSet<BookModel> books { get; set; }
        public DbSet<TemplateModel> templates { get; set; }
        public DbSet<UserModel> users { get; set; }

        #endregion
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
        }
    }
}
