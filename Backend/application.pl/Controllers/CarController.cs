using AutoMapper;
using DataLayer.Entities;
using DataLayer.Repository;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using BusinessLayer.Car.DTO;
using BusinessLayer.Car.Services;
namespace application.pl.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly ICarService CarService;
        private readonly IRepository<Car> CarRepo;
        private readonly IMapper mapper;

        public CarController(IRepository<Car> carRepo, IMapper mapper, ICarService carService)
        {
            CarRepo = carRepo;
            this.mapper = mapper;
            CarService = carService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var cars = await CarService.Get();
            var carsDto = mapper.Map<IEnumerable<CarManufacturerDTO>>(cars);
            if (cars == null)
                return BadRequest();
            return Ok(carsDto);
        }

        [HttpGet("/GetAllActiveCars")]
        public async Task<IActionResult> GetAllCars()
        {
            var cars = await CarService.GetAll();
            var carsDto = mapper.Map<List<CarManufacturerDTO>>(cars);
            if (cars == null)
                return BadRequest();
            return Ok(carsDto);
        }
        //Pagenation

        [HttpGet("{pagenumber:int}/ {pagesize:int}")]
        public async Task<IActionResult> GetAll(int pagenumber, int pagesize)
        {
            var cars = await CarService.GetAll(pagenumber, pagesize);
            var carsDto = mapper.Map<List<CarManufacturerDTO>>(cars);
            if (cars == null)
                return BadRequest();
            return Ok(carsDto);
        }

        [HttpGet("{id:int}", Name = "GetByIdRoute")]
        public async Task<IActionResult> GetById(int id)
        {
            var car = await CarService.GetById(id);
            var carDto = mapper.Map<CarManufacturerDTO>(car);
            if (car == null)
                return NotFound("Car not found");
            return Ok(carDto);
        }


        [HttpPost("/api/Car/Upload")]
        public IActionResult Upload(IFormFile image)
        {
            if (image != null && image.Length > 0)
            {
                string wwwRootPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

                string uniqueFileName = Guid.NewGuid().ToString() + "_" + image.FileName;

                string filePath = Path.Combine(wwwRootPath, "uploads", uniqueFileName);

                Directory.CreateDirectory(Path.GetDirectoryName(filePath));

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    image.CopyTo(stream);
                }

                return Ok(new { Message = "File uploaded successfully", FileName = uniqueFileName });
            }
            return BadRequest("Invalid image file.");
        }

        [HttpPost]
        public async Task<IActionResult> Add(AddCarDTO modelDto)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    Car model = mapper.Map<Car>(modelDto);
                    await CarRepo.Insert(model);
                    string url = Url.Link("GetByIdRoute", new { id = model.Id })!;
                    return Created(url, model);
                }
                catch (Exception ex)
                {

                    return BadRequest(ex.Message);
                }
            }
            return BadRequest(ModelState);
        }

        [HttpPut]
        public async Task<IActionResult> Update(EditCarDTO modelDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingCar = await CarRepo.GetById(modelDto.Id);

            if (existingCar == null)
            {
                return NotFound("Car not found");
            }

           
            mapper.Map(modelDto, existingCar);

            try
            {
                await CarRepo.Update(existingCar);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var car = await CarRepo.GetById(id);
            if (car == null)
                return NotFound("Car not found");

            try
            {
                await CarRepo.Delete(car);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }


}
