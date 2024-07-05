using BusinessLayer.Account.Services;
using BusinessLayer.Helpers;
using BusinessLayer.BookingServices.Service;
using BusinessLayer.OfferManagement.Services;
using DataLayer.Context;
using DataLayer.Repository;
using Microsoft.EntityFrameworkCore;
using BusinessLayer.WishlistItem.Mapping;
using BusinessLayer.Car.Mapping;
using DataLayer.Entities;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Text;

using Services.Stripe;
using Stripe;
using BusinessLayer.Complaints.Services;
using BusinessLayer.Manifacturers.Services;
using BusinessLayer.Payments.Services;
using Services.EmailService;
using BusinessLayer.BookingServices.Mapper;
using BusinessLayer.ReviewService.Service;
using BusinessLayer.Car.Services;
using BusinessLayer.WishlistItem.Service;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace application.pl
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromMinutes(30); 
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });

            builder.Services.AddControllers(options => options.SuppressImplicitRequiredAttributeForNonNullableReferenceTypes = true);
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();

            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
                c.OperationFilter<FileUploadOperationFilter>(); // Add this line
            });

            builder.Services.Configure<JWT>(builder.Configuration.GetSection("JWT"));


            builder.Services.AddIdentity<User, IdentityRole<int>>(option =>
            {
                option.SignIn.RequireConfirmedEmail = true;
            }).AddEntityFrameworkStores<CarvistaDbContext>().AddDefaultTokenProviders();

            builder.Services.AddScoped<IUserAccount, UserAccount>();
            builder.Services.AddScoped<OfferService>();
            builder.Services.AddScoped<IEmailsService, EmailService>();
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddDbContext<CarvistaDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("carvistaConnectionString")));
            builder.Services.AddCors(corsOptions =>
            {
                corsOptions.AddPolicy("myPolicy1", corsPolicyBuilder =>
                {
                    corsPolicyBuilder.AllowAnyOrigin();
                });
            });
            builder.Services.AddAuthentication(opts =>
            {
                opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                opts.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(opts =>
            {
                opts.SaveToken = true;
                opts.RequireHttpsMetadata = false;
                opts.TokenValidationParameters = new()
                {
                    ValidateIssuer = true,
                    ValidIssuer = builder.Configuration["JWT:Issuer"],
                    ValidateAudience = true,
                    ValidAudience = builder.Configuration["JWT:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Key"]))
                };
            });


            var emailConfig = builder.Configuration
                                           .GetSection("EmailConfiguration")
                                           .Get<EmailConfiguration>();
            builder.Services.AddSingleton(emailConfig);
            builder.Services.AddDbContext<CarvistaDbContext>(option => option.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("carvistaConnectionString")));


            builder.Services.AddScoped<IOfferService, OfferService>();
            builder.Services.AddScoped<IBookingService, BookingService>();
            builder.Services.AddScoped<IReviewService, BusinessLayer.ReviewService.Service.ReviewService>();

            builder.Services.AddAutoMapper(typeof(MappingProfile));

            builder.Services.AddDbContext<CarvistaDbContext>(option => option.UseLazyLoadingProxies().UseSqlServer(builder.Configuration.GetConnectionString("carvistaConnectionString")));
            builder.Services.AddAutoMapper(typeof(CarProfile));
            builder.Services.AddAutoMapper(typeof(WishlistProfile));
            builder.Services.AddHttpContextAccessor();

            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddAutoMapper(typeof(CarProfile));
            builder.Services.AddAutoMapper(typeof(WishlistProfile));
            builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
            builder.Services.AddScoped<ComplaintServices>();
            builder.Services.AddScoped<ManfServices>();
            builder.Services.AddScoped<PaymentService>();
            builder.Services.AddScoped<StripeService>();
            builder.Services.AddHttpContextAccessor();
            builder.Services.AddScoped<ICarService, CarService>();
            builder.Services.AddScoped<IWishlistService, WishlistService>();
            //builder.Services.AddScoped<DocuSealClient>();

            // Add services to the container.
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAnyOrigin",
                    policy =>
                    {
                        policy.AllowAnyOrigin()
                              .AllowAnyHeader()
                              .AllowAnyMethod();
                    });
            });
            builder.Services.AddDbContext<CarvistaDbContext>(option => option.UseSqlServer(builder.Configuration.GetConnectionString("carvistaConnectionString")));


            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {

            }

            app.UseSwagger();
            app.UseSwaggerUI(c =>
            {
                c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
            });

            Initialize(app.Services).Wait();


            StripeConfiguration.ApiKey = builder.Configuration.GetSection("Stripe")["SecretKey"];

            app.UseCors("AllowAnyOrigin");
            app.UseStaticFiles();
            app.UseAuthorization();
            app.UseSession();
            app.MapControllers();

            app.Run();
        }

        public static async Task Initialize(IServiceProvider serviceProvider)
        {

            using (var scope = serviceProvider.CreateScope())
            {
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole<int>>>();

                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();

                string[] roleNames = { "Admin", "User", "Driver" };

                foreach (var roleName in roleNames)
                {
                    var roleExist = await roleManager.RoleExistsAsync(roleName);
                    if (!roleExist)
                    {
                        await roleManager.CreateAsync(new IdentityRole<int>(roleName));
                    }
                }

                var adminUser = await userManager.FindByEmailAsync("admin@gmail.com");
                if (adminUser == null)
                {
                    var newUser = new Admin
                    {
                        UserName = "Admin",
                        Email = "admin@carvista.com",
                        EmailConfirmed = true,
                        isActive = true,

                    };

                    var createUserResult = await userManager.CreateAsync(newUser, "Admin@123");
                    if (createUserResult.Succeeded)
                    {
                        await userManager.AddToRoleAsync(newUser, "Admin");
                    }
                    else
                    {
                        // Handle errors during user creation
                        foreach (var error in createUserResult.Errors)
                        {
                            Console.WriteLine($"Error creating admin user: {error.Description}");
                        }
                    }

                }
            }
        }

        public class FileUploadOperationFilter : IOperationFilter
        {
            public void Apply(OpenApiOperation operation, OperationFilterContext context)
            {
                var formFileParameters = context.MethodInfo.GetParameters()
                    .Where(p => p.ParameterType == typeof(IFormFile) ||
                                p.ParameterType == typeof(IEnumerable<IFormFile>));

                if (formFileParameters.Any())
                {
                    operation.Parameters.Clear();

                    operation.RequestBody = new OpenApiRequestBody
                    {
                        Content = new Dictionary<string, OpenApiMediaType>
                        {
                            ["multipart/form-data"] = new OpenApiMediaType
                            {
                                Schema = new OpenApiSchema
                                {
                                    Type = "object",
                                    Properties = new Dictionary<string, OpenApiSchema>
                                    {
                                        ["image"] = new OpenApiSchema
                                        {
                                            Type = "string",
                                            Format = "binary"
                                        }
                                    }
                                }
                            }
                        }
                    };
                }
            }
        }
    }
}
