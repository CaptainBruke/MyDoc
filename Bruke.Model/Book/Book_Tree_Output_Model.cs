using System;
using System.Collections.Generic;
using System.Text;

namespace Bruke.Model
{
    public class Book_Tree_Output_Model
    {
        public int id { get; set; }
        public string name { get; set; }
        public BookTreeType type { get; set; }
        public List<Book_Tree_Output_Model> children { get; set; }
    }
    public enum BookTreeType
    {
        Root,
        Book1,
        Book2,
        Article
    }
}
