using System.ComponentModel.DataAnnotations;

namespace ProductAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        [MaxLength(100)]
        public string Username { get; set; }
        public string Password { get; set; }
    }
}
