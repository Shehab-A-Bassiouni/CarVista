//using Microsoft.AspNetCore.Mvc;
//using DataLayer.Repository;
//using DataLayer.Entities;
//using AutoMapper;
//using BusinessLayer.Contract.DTO;
//namespace application.pl.Controllers
//{
//    [Route("api/[controller]")]
//    [ApiController]
//    public class ContractController : ControllerBase
//    {
//        private readonly IRepository<DataLayer.Entities.Contract> Repo;
//        private readonly IRepository<DataLayer.Entities.Signature> SignatureRepo;
//        private readonly IMapper mapper;
//        DocuSealClient doc;
//        public ContractController(IRepository<DataLayer.Entities.Contract> repo, IRepository<Signature> signatureRepo, IMapper mapper, IWebHostEnvironment env, DocuSealClient doc)
//        {
//            Repo = repo;
//            SignatureRepo = signatureRepo;
//            this.mapper = mapper;
//            this.doc = doc;
//        }
//        //[HttpGet("sign")]
//        //public async Task<IActionResult> SignContract()
//        //{
//        //    return Ok(await doc.InitiateDocumentSigning());
//        //}

//        [HttpGet("{signatureRequestId:alpha}/verify")]
//        public async Task<IActionResult> VerifySignature(string signatureRequestId)
//        {
//            return Ok(await doc.CheckSigningStatus(signatureRequestId));
//        }
//        [HttpGet("{signatureRequestId}/download")]
//        public async Task<IActionResult> GetAll(string signatureRequestId)
//        {
//            return Ok(await doc.DownloadSignedDocument(signatureRequestId));
//        }
//        [HttpGet]
//        public async Task<IActionResult> GetAll()
//        {
//            var contracts = await Repo.GetAll();
//            var contractsDto = mapper.Map<IEnumerable<ContractDTO>>(contracts);
//            if (contracts == null)
//                return BadRequest();
//            return Ok(contractsDto);
//        }
//        [HttpGet("{id:int}")]
//        public async Task<IActionResult> GetById(int id)
//        {
//            var contract = await Repo.GetById(id);
//            var contractDto = mapper.Map<ContractDTO>(contract);
//            if (contract == null)
//                return NotFound();
//            return Ok(contractDto);
//        }
//        [HttpPost]
//        public async Task<IActionResult> Add(AddContractDTO modelDto)
//        {
//            if(ModelState.IsValid)
//            {
//                var model = mapper.Map<DataLayer.Entities.Contract>(modelDto);
//                try
//                {
//                    await Repo.Insert(model);
//                    return Created("" , model);
//                }
//                catch (Exception ex)
//                {

//                    return BadRequest(ex.Message);
//                }
//            }
//            return BadRequest(ModelState);
//        }
//        [HttpDelete("{id:int}")]
//        public async Task<IActionResult> Delete(int id)
//        {
//            var contract = await Repo.GetById(id);
//            if (contract == null)
//                return NotFound("item not found");

//            try
//            {
//                await Repo.Delete(contract);
//                return NoContent();
//            }
//            catch (Exception ex)
//            {
//                return BadRequest(ex.Message);
//            }
//        }
//    }
//}
