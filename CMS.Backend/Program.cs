using CMS.Data;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Grpc.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Authentication Cookie
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Account/Login";
        options.AccessDeniedPath = "/Account/AccessDenied";
    });

// Authorization
builder.Services.AddAuthorization();

// MVC
builder.Services.AddControllersWithViews();

// DbContext
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// =============================
// SWAGGER
// =============================
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
//Grpc
builder.Services.AddGrpc();
// 1. Khai báo chính sách CORS
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAll", policy => {
        // Cho phép mọi nguồn (Origin), mọi phương thức (GET, POST...), mọi tiêu đề (Header)
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// =============================
// BẬT SWAGGER
// =============================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();
// 2. Kích hoạt chính sách CORS đã khai báo ở trên
app.UseCors("AllowAll");

app.UseAuthentication();
app.UseAuthorization();
// GRPC
// =============================
app.MapGrpcService<PostGrpcService>();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");


app.Run();