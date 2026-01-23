using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.API.Controllers
{
    [Route("api/[controller]")]
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

        // ENDPOINT 1: Get list of Clients
        [HttpGet("clients")]
        public async Task<IActionResult> GetClients()
        {
            // FIX: Changed OrganizationID -> OrganizationId
            var clients = await _context.Organizations
                .Select(o => new { o.OrganizationId, o.Name })
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
    }
}