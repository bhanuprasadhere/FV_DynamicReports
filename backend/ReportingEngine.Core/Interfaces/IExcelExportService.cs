using System.Threading.Tasks;
using ReportingEngine.Core.DTOs;

namespace ReportingEngine.Core.Interfaces
{
    public interface IExcelExportService
    {
        /// <summary>
        /// Generates an Excel file from report data
        /// </summary>
        Task<byte[]> GenerateExcelAsync(DynamicReportResultDto reportData, string fileName = "Report");
    }
}
