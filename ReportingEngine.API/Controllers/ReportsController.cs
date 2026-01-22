using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.API.Controllers
{
    [Route("api/[controller]")] // This means the base URL is /api/reports
    [ApiController]
    public class ReportsController : ControllerBase
    {
        private readonly ITemplateService _templateService;
        private readonly ReportingDbContext _context;

        public ReportsController(ITemplateService templateService, ReportingDbContext context)
        {
            _templateService = templateService;
            _context = context;
        }

        // ENDPOINT 1: Get list of Clients (for the Dropdown)
        // URL: http://localhost:5008/api/reports/clients
        [HttpGet("clients")]
        public async Task<IActionResult> GetClients()
        {
            // We fetch just ID and Name to keep it light
            var clients = await _context.Organizations
                .Select(o => new { o.OrganizationID, o.Name })
                .ToListAsync();

            return Ok(clients);
        }

        // ENDPOINT 2: Get the Drag-and-Drop Questions (Schema)
        // URL: http://localhost:5008/api/reports/schema/{clientId}
        [HttpGet("schema/{clientId}")]
        public IActionResult GetSchema(int clientId)
        {
            var data = _templateService.GetQuestionsForClient(clientId);
            return Ok(data);
        }
    }
}