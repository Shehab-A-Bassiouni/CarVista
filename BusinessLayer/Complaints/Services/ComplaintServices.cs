using BusinessLayer.Complaints.DTO;
using BusinessLayer.Complaints.Mapping;
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

namespace BusinessLayer.Complaints.Services
{
    public class ComplaintServices
    {
        private readonly IRepository<Complaint> _complaintRepository;
        private readonly CarvistaDbContext db;

        public ComplaintServices(IRepository<Complaint> complaintRepository,CarvistaDbContext db)
        {
            _complaintRepository = complaintRepository;
            this.db = db;
        }

        public async Task<IEnumerable<ComplaintDTO>> GetComplaintsAsync()
        {
            var complaints = await db.Complaints
                                      .Include(c => c.Customer) 
                                      .ToListAsync();
            var complaintDTOs = new List<ComplaintDTO>();

            foreach (var complaint in complaints)
            {
                if(complaint.isActive)
                 complaintDTOs.Add(ComplaintDTOMapping.MapToDTO(complaint));
            }

            return complaintDTOs;
        }
        
        public async Task<ComplaintDTO> GetComplaintByIdAsync(int id)
        {
            var complaint = await _complaintRepository.GetById(id);

            if (complaint is not null)
            {
                if (complaint.isActive)
                    return  ComplaintDTOMapping.MapToDTO(complaint);
            }

            return null;

        }

        
        public async Task<Complaint> CreateCopmlaintAsync(ComplaintDTO complaintDTO)
        {
            var complainEntity = ComplaintDTOMapping.MapToEntity(complaintDTO);
            var insertedEntity = await _complaintRepository.Insert(complainEntity);
            return insertedEntity;
        }

        
        public async Task<Complaint> UpdateComplaintAsync (ComplaintDTO complaintDTO)
        {
            var complainEntity = ComplaintDTOMapping.MapToEntity(complaintDTO);
            var updatedEntity = await _complaintRepository.Update(complainEntity);
            return updatedEntity;
        }

        public async Task DeleteComplaintAsync(int id)
        {
            var complaint = await _complaintRepository.GetById(id);
            if (complaint !=null)
            {
                await _complaintRepository.Delete(complaint);
            }
        }
    }
}
