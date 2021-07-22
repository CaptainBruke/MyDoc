using AutoMapper;
using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class AutoMapperConfig: Profile
    {
        public AutoMapperConfig()
        {
            CreateMap<BookModel, Book_Add_Input_Model>().ReverseMap();
            CreateMap<ArticleModel, Article_Add_Input_Model>().ReverseMap();
        }
    }
}
