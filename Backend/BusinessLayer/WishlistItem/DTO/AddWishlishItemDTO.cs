using DataLayer.Entities;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.WishlistItem.DTO
{
    public class AddWishlishItemDTO
    {
        [Required]
        public int CustomerId { get; set; }


        [Required]
        public int CarId { get; set; }

        [Required]
        public bool isActive { get; set; }
    }
}
