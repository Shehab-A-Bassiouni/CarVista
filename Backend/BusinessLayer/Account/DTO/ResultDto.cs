using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Account.DTO
{
    public class ResultDto
    {

        public string Message { get; set; }
        
        public bool succeded { get; set; }
        public object data {  get; set; }
    }
}
