using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Account.DTO
{
    public class ConfirmDTO
    {

        public int userId { get; set; }
        public string code { get; set; }
    }
}
