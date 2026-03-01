namespace LibraryAPI.Models
{
    public class Book
    {
        public int Id { get; set; }          // Primary key
        public string Title { get; set; }    // Book title
        public string Author { get; set; }   // Book author
        public string Description { get; set; } // Book description
    }
}

