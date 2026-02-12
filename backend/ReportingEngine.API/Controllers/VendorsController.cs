using Microsoft.AspNetCore.Mvc;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;

namespace ReportingEngine.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VendorsController : ControllerBase
    {
        private readonly IReportService _reportService;

        public VendorsController(IReportService reportService)
        {
            _reportService = reportService;
        }

        /// <summary>
        /// Gets vendor statistics fields available for drag-drop
        /// </summary>
        [HttpGet("stats")]
        public ActionResult<List<VendorStatsDto>> GetVendorStats()
        {
            var stats = _reportService.GetVendorStatsFields();
            return Ok(stats);
        }
    }
}
