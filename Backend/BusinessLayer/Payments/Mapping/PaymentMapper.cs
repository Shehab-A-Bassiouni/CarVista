using BusinessLayer.Complaints.DTO;
using BusinessLayer.Payments.DTO;
using DataLayer.Entities;
using Services.Stripe;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Payments.Mapping
{
    public class PaymentMapper
    {
        public static PaymentDTO MapToDTO(Payment payment)
        {
            if (payment != null)
            {
                return new PaymentDTO
                {
                   Id = payment.Id,
                   Amount = payment.Amount,
                   Date = payment.Date,
                   Type = payment.Type,
                   BookingId = payment.BookingId
                };
            }
            return null;
        }

        public static Payment MapToEntity(PaymentDTO paymentDTO)
        {
            if (paymentDTO != null)
            {
                return new Payment
                {
                    Id = paymentDTO.Id,
                    Type = paymentDTO.Type,
                    Date = paymentDTO.Date,
                    Amount= paymentDTO.Amount,
                    BookingId = paymentDTO.BookingId,
                    isActive = true
                };
            }
            return null;
        }

        public static PaymentRequest ToPaymentRequest(PaymentDTO paymentDTO, string email, string token)
        {
            return new PaymentRequest
            {
                Email = email,
                Token = token,
                Amount = paymentDTO.Amount, 
                BookingId = paymentDTO.BookingId
            };
        }
    }
}
