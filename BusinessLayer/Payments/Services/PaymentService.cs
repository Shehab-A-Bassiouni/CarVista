using BusinessLayer.Complaints.DTO;
using BusinessLayer.Complaints.Mapping;
using BusinessLayer.Payments.DTO;
using BusinessLayer.Payments.Mapping;
using DataLayer.Context;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BusinessLayer.Payments.Services
{
    public class PaymentService
    {
        private readonly IRepository<Payment> PaymentRepo;
        private readonly CarvistaDbContext db;

        public PaymentService(IRepository<Payment> paymentRepo, CarvistaDbContext db)
        {
            PaymentRepo = paymentRepo;
            this.db = db;
        }

        public async Task<IEnumerable<PaymentDTO>> GetPaymentsAsync()
        {
            var payments = await PaymentRepo.GetAll();

            var paymentsDTO = new List<PaymentDTO>();

            foreach (var payment in payments)
            {
                if (payment.isActive)
                paymentsDTO.Add(PaymentMapper.MapToDTO(payment));
            }

            return paymentsDTO;
        }

        public async Task<PaymentDTO> GetPaymentByIdAsync(int id)
        {
            var payment = await PaymentRepo.GetById(id);
            if(payment is not null)
            {
                if (payment.isActive)
                    return PaymentMapper.MapToDTO(payment);
            }

            return null;
        }


        public async Task<Payment> CreatePaymentAsync(PaymentDTO paymentDTO)
        {
            var paymentEntity = PaymentMapper.MapToEntity(paymentDTO);
            var insertedEntity = await PaymentRepo.Insert(paymentEntity);
            return insertedEntity;
        }


        public async Task<Payment> UpdatePaymentAsync(PaymentDTO paymentDTO)
        {
            var paymentEntity = PaymentMapper.MapToEntity(paymentDTO);
            var updatedEntity = await PaymentRepo.Update(paymentEntity);
            return updatedEntity;
        }

        public async Task DeletePaymentAsync(int id)
        {
            var payment = await PaymentRepo.GetById(id);
            if (payment != null)
            {
                await PaymentRepo.Delete(payment);
            }
        }
    }
}
