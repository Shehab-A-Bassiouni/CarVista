using BusinessLayer.Account.DTO;
using BusinessLayer.Account.Services;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Services.EmailService;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace application.pl.Controllers.AccountController
{
    [Route("api/[controller]")]
    [ApiController]

    public class AccountController : ControllerBase
    {
        private readonly IUserAccount _userAccount;


        [HttpGet("session-id")]
        public IActionResult GetSessionId()
        {
            var isNewSession = !HttpContext.Session.TryGetValue("Initialized", out _);
            if (isNewSession)
            {
                HttpContext.Session.SetString("Initialized", "true");
            }

            var sessionId = HttpContext.Session.Id;

            return Ok(new { sessionId });
        }

        public AccountController(IUserAccount _usrAccount)
        {
            _userAccount = _usrAccount;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userAccount.Register(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);
            if (!result.Succedded)
                return BadRequest(result.Message);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userAccount.Login(model);

            if (!result.IsAuthenticated)
                return BadRequest(result.Message);

            return Ok(result);
        }

        [HttpPost("Edit")]
        public async Task<IActionResult> Edit([FromBody] EditPRofileDTO model)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var result = await _userAccount.Edit(model);

            if (!result.succeded)
                return BadRequest(result.Message);

            return Ok(result.data);
        }

        [HttpPost("ConfirmEmail")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] ConfirmDTO query)
        {
            var response = await _userAccount.ConfirmEmail(query.userId, query.code);
            if (response.succeded)
                return Ok(response);
            else
                return BadRequest(response);
             
        }

        [HttpPost("ForgetPassword")]
        public async Task<IActionResult> ForgetPassword([FromBody] ForgetPAsswordDTO model)
        {

            var response = await _userAccount.ForgetPassword(model.Email);
            if (response.succeded)
                return Ok(response);
            else
                return BadRequest(response);

        }

        [HttpGet("ResetPassword")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDTO model)
        {

            var response = await _userAccount.RestetPassword(model);
            if (response.succeded)
                return Ok(response);
            else
                return BadRequest(response);

        }
        
        
        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var response = await _userAccount.GetUser(id);
            if (response.succeded)
                return Ok(response.data);
            else
                return BadRequest(response.Message);
        }

        // GET: api/<AccountController>

        [HttpGet("AvailableUsers")]
        public async Task<IActionResult> GetAllAvailableUsers()
        {
            var offers = await _userAccount.GetAllAvailableUsers();
            return Ok(offers);
        }

        [HttpGet]
        public IEnumerable<string> Get()
        {
            return new string[] { "value1", "value2" };
        }

        // GET api/<AccountController>/5
        // GET api/<AccountController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}


        // POST api/<AccountController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<AccountController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<AccountController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
