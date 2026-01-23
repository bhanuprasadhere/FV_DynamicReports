using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;
using ReportingEngine.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// --- THE NUCLEAR FIX: HARDCODED CONNECTION STRING ---
var connectionString = @"Server=localhost\SQLEXPRESS;Database=pqFirstVerifyProduction;Trusted_Connection=True;TrustServerCertificate=True;MultipleActiveResultSets=true";

// Add DB Context
builder.Services.AddDbContext<ReportingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
        sqlOptions => sqlOptions.UseCompatibilityLevel(120)));

// Add Services
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddControllers();

// Enable CORS for the Frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy => policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

// (Swagger lines removed to fix build error)

app.UseCors("AllowReactApp");
app.UseAuthorization();
app.MapControllers();

app.Run();