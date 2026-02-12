using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ITemplateService _templateService;
        private readonly IReportService _reportService;
        private readonly IExcelExportService _excelService;
        private readonly ReportingDbContext _context;

        public ReportsController(
            ITemplateService templateService, 
            IReportService reportService,
            IExcelExportService excelService,
            ReportingDbContext context)
        {
            _templateService = templateService;
            _reportService = reportService;
            _excelService = excelService;
            _context = context;
        }

        // ENDPOINT 1: Get list of Clients
        [HttpGet("clients")]
        public async Task<IActionResult> GetClients()
        {
            // Filter to only show Super Client, Admin, and Client organization types
            var validTypes = new[] { "Super Client", "Admin", "Client" };
            
            var clients = await _context.Organizations
                .Where(o => validTypes.Contains(o.OrganizationType))
                .Select(o => new { o.OrganizationId, o.Name })
                .OrderBy(o => o.Name)
                .ToListAsync();

            return Ok(clients);
        }

        // ENDPOINT 2: Get the Drag-and-Drop Questions (Schema)
        [HttpGet("schema/{clientId}")]
        public async Task<IActionResult> GetSchema(long clientId)
        {
            var data = await _templateService.GetQuestionsForClientAsync(clientId);
            return Ok(data);
        }

        // NEW ENDPOINT 3: Get questions with ALL risk levels for a client
        [HttpGet("questions/{clientId}")]
        public async Task<ActionResult<List<QuestionWithRiskLevelsDto>>> GetQuestionsWithRiskLevels(int clientId)
        {
            var questions = await _reportService.GetQuestionsWithRiskLevelsAsync(clientId);
            return Ok(questions);
        }

        // NEW ENDPOINT 4: Generate dynamic report based on selected columns
        [HttpPost("generate")]
        public async Task<ActionResult<DynamicReportResultDto>> GenerateReport(
            [FromBody] List<ReportColumnDto> columns,
            [FromQuery] int clientId)
        {
            if (columns == null || columns.Count == 0)
            {
                return BadRequest("At least one column must be selected");
            }

            var result = await _reportService.GenerateDynamicReportAsync(columns, clientId);
            return Ok(result);
        }

        // NEW ENDPOINT 5: Export report data to Excel
        [HttpPost("export/excel")]
        public async Task<IActionResult> ExportToExcel([FromBody] DynamicReportResultDto reportData)
        {
            if (reportData == null || reportData.Rows.Count == 0)
            {
                return BadRequest("No data to export");
            }

            var excelBytes = await _excelService.GenerateExcelAsync(reportData);
            var fileName = $"Report_{DateTime.Now:yyyyMMdd_HHmmss}.xlsx";
            
            return File(excelBytes, 
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", 
                fileName);
        }
    }
}