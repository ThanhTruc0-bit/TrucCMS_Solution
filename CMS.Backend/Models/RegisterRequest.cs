namespace CMS.Backend.Models
{
    public class RegisterRequest
    {
        public string Username { get; set; }
        public string PasswordHash { get; set; }
        public string FullName { get; set; }

        public string Email { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
    }
}