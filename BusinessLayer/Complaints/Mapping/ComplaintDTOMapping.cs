using BusinessLayer.Complaints.DTO;
using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Complaints.Mapping
{
    public class ComplaintDTOMapping
    {
        public static ComplaintDTO MapToDTO(Complaint comp)
        {
            if(comp !=null)
            {
                return new ComplaintDTO
                {
                    Id = comp.Id,
                    ComplaintBody = comp.ComplaintText,
                    State = comp.State,
                    Date = comp.Date,
                    CustomerId = comp.CustomerId,
                    ClaimantFullName = string.Concat(comp.Customer.FirstName, " ", comp.Customer.LastName)
                };
            }
            return null;
        }

        public static Complaint MapToEntity(ComplaintDTO compDTO)
        {
            if (compDTO != null) 
            {
                return new Complaint
                {
                    Id = compDTO.Id,
                    ComplaintText = compDTO.ComplaintBody,
                    Date = compDTO.Date,
                    CustomerId = compDTO.CustomerId,
                    State = compDTO.State,
                    isActive = true
                };
            }
            return null;
        }
    }
}
