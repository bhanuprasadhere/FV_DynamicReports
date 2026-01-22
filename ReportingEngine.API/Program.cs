using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;
using ReportingEngine.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddOpenApi();

// Add DbContext
var connectionString = "Server=localhost;Database=pqFirstVerifyProduction;Trusted_Connection=True;TrustServerCertificate=True;";
builder.Services.AddDbContext<ReportingDbContext>(options =>
    options.UseSqlServer(connectionString));

// Register Services
builder.Services.AddScoped<ITemplateService, TemplateService>();

// Add CORS for React frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseCors("AllowReact");
app.MapControllers();

app.Run();
