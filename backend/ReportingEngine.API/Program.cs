using Microsoft.EntityFrameworkCore;
using ReportingEngine.Infrastructure.Data;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Services;

var builder = WebApplication.CreateBuilder(args);

// 1. Add CORS Policy (Allows Frontend to talk to Backend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

// 2. Add Database Context (With Compatibility Level 120 for your older SQL Server)
builder.Services.AddDbContext<ReportingDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"),
    sqlOptions => sqlOptions.UseCompatibilityLevel(120)));

// 3. Register Services
builder.Services.AddScoped<ITemplateService, TemplateService>();
builder.Services.AddScoped<IReportService, ReportService>();
builder.Services.AddScoped<IExcelExportService, ExcelExportService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// 4. Configure Pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// 5. Enable CORS (Must be before MapControllers)
app.UseCors("AllowAll");

app.UseAuthorization();
app.MapControllers();

app.Run();