using AutoMapper;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using BusinessLayer.WishlistItem.DTO;
using BusinessLayer.WishlistItem.Service;
using Stripe;
namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WishlistController : ControllerBase
    {
        private readonly IRepository<WishlistItem> _Repo;
        private readonly IWishlistService _service;
        private readonly IMapper _Mapper;
        public WishlistController(DataLayer.Repository.IRepository<WishlistItem> repo, IMapper mapper, IWishlistService service)
        {
            _Repo = repo;
            _Mapper = mapper;
            _service = service;
        }

        [HttpGet("{userId:int}")]
        public async Task<IActionResult> GetAll(int userId)
        {
            var items = await _service.GetAll(userId);
            var itemsDto = _Mapper.Map<IEnumerable<WishListDTO>>(items);
            if (items == null)
                return BadRequest();
            return Ok(itemsDto);
        }

        [HttpGet("forallusers")]
        public async Task<IActionResult> GetForAllUsers()
        {
            var items = await _service.GetForAllUsers();
            var itemsDto = _Mapper.Map<IEnumerable<WishListDTO>>(items);
            if (items == null)
                return BadRequest();
            return Ok(itemsDto);
        }

        [HttpGet("2PropList")]
        public async Task<IActionResult> GetForAll_2Prop()
        {
            var items = await _service.GetForAllUsers();
            var itemsDto = _Mapper.Map<IEnumerable<_2PropWishListDTO>>(items);
            if (items == null)
                return BadRequest();
            return Ok(itemsDto);
        }

        [HttpGet("CarDetils")]
        public async Task<IActionResult> GetCarDetails()
        {
            var items = await _service.GetForAllUsers();
            var itemsDto = _Mapper.Map<IEnumerable<AllCarDetailsDTO>>(items);
            if (items == null)
                return BadRequest();
            return Ok(itemsDto);
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddWishlishItemDTO modelDto)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var model = _Mapper.Map<WishlistItem>(modelDto);
                    await _Repo.Insert(model);
                    return Created("", model);
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _Repo.GetById(id);
            if (item == null)
                return NotFound("item not found");

            try
            {
                await _Repo.Delete(item);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

    }
}
