using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace CMS.Data.Entities
{
    public class Customer
    {
        [Key]
        public int Id { get; set; }

        public int? UserId { get; set; }

        public virtual User? User { get; set; }

        [Required]
        public string FullName { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        public string? Phone { get; set; }

        public string? Address { get; set; }

        public virtual ICollection<Order>? Orders { get; set; }
    }
}