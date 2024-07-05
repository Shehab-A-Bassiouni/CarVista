using BusinessLayer.Helpers;
using BusinessLayer.Account.DTO;
using DataLayer.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using DataLayer.Repository;
using static System.Runtime.InteropServices.JavaScript.JSType;
using static System.Net.Mime.MediaTypeNames;
using System.Security.Cryptography.Xml;
using System.Security.Principal;
using Microsoft.AspNetCore.Http;
using Services.EmailService;
using Services;
using DataLayer.Context;
using static System.Net.WebRequestMethods;
using Microsoft.EntityFrameworkCore;
using System.Security.Policy;
using System.Numerics;

namespace BusinessLayer.Account.Services
{
    public class UserAccount : IUserAccount
    {
        private readonly UserManager<User> _userManager;
        private readonly IRepository<Customer> _userRepo;
        //private readonly RoleManager<IdentityRole> _roleManager;
        private readonly RoleManager<IdentityRole<int>> _roleManager;


        private readonly JWT _jwt;
        private readonly IHttpContextAccessor _ihttpAccessor;
        private readonly IEmailsService _emailService;
        private readonly CarvistaDbContext _carvistaDBcontext;


        public UserAccount(UserManager<User> userManager, RoleManager<IdentityRole<int>> roleManager, IOptions<JWT> jwt,
            IRepository<Customer> userRepo, IHttpContextAccessor ihttpAccessor, 
            IEmailsService emailservice, CarvistaDbContext carvistaDbContext)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _jwt = jwt.Value;
            _userRepo = userRepo;
            _ihttpAccessor = ihttpAccessor;
            _emailService = emailservice;
            _carvistaDBcontext = carvistaDbContext;
        }
        public async Task<AuthModel> Login(LoginDTO model)
        {
            var authModel = new AuthModel();

            var user = await _userManager.FindByNameAsync(model.Username);
            //var user = await _userManager.FindByIdAsync()
           // var user = await _userManager.FindByNameAsync(model.Email);

            if (user is null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                authModel.Message = "Email or Password is incorrect!";
                return authModel;
            }

            var jwtSecurityToken = await CreateJwtToken(user);
            var rolesList = await _userManager.GetRolesAsync(user);

            authModel.IsAuthenticated = true;
            authModel.Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken);
            authModel.Email = user.Email;
            authModel.Username = user.UserName;
            authModel.Id = user.Id;
            authModel.ExpiresOn = jwtSecurityToken.ValidTo;
            authModel.Roles = rolesList.ToList();
           



            return authModel;
        }
    

        public async Task<AuthModel> Register(UserRegisterDTO model)
        {

            var trans = _carvistaDBcontext.Database.BeginTransaction();
            try
            {
                if (await _userManager.FindByEmailAsync(model.Email) is not null)
                    return new AuthModel { Message = "Email is already registered!" };

                if (await _userManager.FindByNameAsync(model.UserName) is not null)
                    return new AuthModel { Message = "Username is already registered!" };

                var user = new Customer
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    isActive = true,
                    Phone = model.PhoneNumber,

                };

                var result = await _userManager.CreateAsync(user, model.Password);

                if (!result.Succeeded)
                {
                    var errors = string.Empty;

                    foreach (var error in result.Errors)
                        errors += $"{error.Description},";

                    return new AuthModel { Message = errors };
                }

                await _userManager.AddToRoleAsync(user, "User");

                var jwtSecurityToken = await CreateJwtToken(user);



                var code = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var requestAccessor = _ihttpAccessor.HttpContext.Request;
                var returnURl = "http://localhost:4200" + $"/ConfirmEmail?userId={user.Id}&code={code}";

                var message = new EmailMessage(new string[] { model.Email }, "Confirmation Email"
                , $"""
                This is Emailconfirmation Link , if you don't request this link Please Ignore It.
                {returnURl}
              """);
                await _emailService.SendEmailAsync(message);
                await trans.CommitAsync();
                return new AuthModel
                {
                    Email = user.Email,
                    Id = user.Id,
                    ExpiresOn = jwtSecurityToken.ValidTo,
                    IsAuthenticated = true,
                    Roles = new List<string> { "User" },
                    Token = new JwtSecurityTokenHandler().WriteToken(jwtSecurityToken),
                    Username = user.UserName,
                    Message  = "Registered successfully"
                };
            }
            catch (Exception e)
            {
                await trans.RollbackAsync();
                return new AuthModel
                {
                    Email = model.Email,
                    Id = 0,

                    IsAuthenticated = false,
                    Roles = new List<string> { },
                    Token = "",
                    Username = model.UserName,
                    Succedded = false,
                }; 

            }



        }


        //private async Task<> create
        private async Task<JwtSecurityToken> CreateJwtToken(User user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);

            // Retrieve user roles
            var roles = await _userManager.GetRolesAsync(user);
            var roleClaims = new List<Claim>();

            // Convert each role into a claim of type "roles"
            foreach (var role in roles)
                roleClaims.Add(new Claim("roles", role));

            // Base claims for the JWT token
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName?? "cc"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()??"ddd"),
                new Claim(JwtRegisteredClaimNames.Email, user.Email??"grg"),
                new Claim("uid", user.Id.ToString()??"fff")
            }
            // Combine base claims, user claims, and role claims
            .Union(userClaims)
            .Union(roleClaims);

            // Create a symmetric security key
            var symmetricSecurityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwt.Key));

            // Create signing credentials
            var signingCredentials = new SigningCredentials(symmetricSecurityKey, SecurityAlgorithms.HmacSha256);

            // Create the JWT security token
            var jwtSecurityToken = new JwtSecurityToken(
                issuer: _jwt.Issuer,
                audience: _jwt.Audience,
                claims: claims,
                expires: DateTime.Now.AddDays(_jwt.DurationInDays),
                signingCredentials: signingCredentials);

            // Return the JWT security token
            return jwtSecurityToken;
        }

        public async Task<ResultDto> Edit(EditPRofileDTO model)
        {
            try
            {

                var user = await _userRepo.GetById(model.Id);

                if (user == null)
                {
                   
                    return new ResultDto { Message = "User Not found", succeded = false, data = model };
                }
                user.Email = model.Email;
                user.FirstName = model.FirstName;
                user.LastName = model.LastName;
                user.Dob = model.Dob;
                user.PhoneNumber = model.Phone;
                user.LicenseExpiration = model.LicenseExpiration;
                user.Address = model.Address;
                //user.Signature = model.Signature;
                user.Image = model.Image;
                user.Identity = model.Identity;
                user.DrivingLicense = model.DrivingLicense;

                await _userRepo.Update(user);

                return new ResultDto { Message = "Update Succeeded", succeded = true, data= model};


            }

            catch (Exception ex)
            {
                return new ResultDto { Message = ex.Message, succeded = false, data= model };
            }
            

        }

        public async Task<ResultDto> ConfirmEmail(int? userID , string code)
        {
            if (userID == null || code == null)
            {
                return  new ResultDto { succeded = false, Message = "Invalid Data" };
            }

            var user = await _userManager.FindByIdAsync(userID.ToString());
            var confirmEmail = await _userManager.ConfirmEmailAsync(user, code);

            if (!confirmEmail.Succeeded)
            {
                return new ResultDto { succeded = false, Message = "Un predicted Error" };
            }
            

             return new ResultDto { succeded = true, Message = "Confirm Succeded" };

        }

        public async Task<ResultDto> ForgetPassword(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user != null)
            {
                var token = await _userManager.GeneratePasswordResetTokenAsync(user);

                var returnURl = "http://localhost:4200" + $"/ResetPassword?email={email}&code={token}";


                var message = new EmailMessage(new string[] { email }, "Password Reset Email"
             , $"""
                Click link below to reset password , if you don't request this link Please Ignore It.
                {returnURl}
                """)
                {

                };
                await _emailService.SendEmailAsync(message);

                return new ResultDto() { succeded = true, Message = "Reset Password Email is Sent ", data = email };

            }
            return new ResultDto() { succeded = false, Message = "Email not found" };
        }

        public async Task<ResultDto> RestetPassword(ResetPasswordDTO model)
        {
            throw new NotImplementedException();
        }

        public async Task<ResultDto> GetUser(int id)
        {
            Customer user = await _userRepo.GetById(id);
            if (user == null)
            {
                return new ResultDto() { succeded = false, Message = "User not found" };
            }

            var data = new UserDataDTO()
            {
                FirstName = user.FirstName,
                LastName = user.LastName,
                Dob = user.Dob,
                Address = user.Address,
                DrivingLicense = user.DrivingLicense,
                Email = user.Email,
                Phone = user.Phone,
                Image = user.Image,
                Identity = user.Identity,
                LicenseExpiration = user.LicenseExpiration,
                UserName = user.UserName,

            };

            return new ResultDto() { succeded = true, data = data, Message = "User is found" };


        }
        public async Task<IEnumerable<User>> GetAllAvailableUsers()
        {
            return await _carvistaDBcontext.Users.Where(O => O.isActive == true).ToListAsync();
        }
    }

   
}

