using System.Collections.Generic;
using System.Threading.Tasks;
using ReportingEngine.Core.DTOs;

namespace ReportingEngine.Core.Interfaces
{
    public interface IReportService
    {
        /// <summary>
        /// Generates a dynamic report based on selected columns (vendor stats + questions)
        /// </summary>
        Task<DynamicReportResultDto> GenerateDynamicReportAsync(List<ReportColumnDto> columns, int clientId);
        
        /// <summary>
        /// Gets vendor statistics fields available for drag-drop
        /// </summary>
        List<VendorStatsDto> GetVendorStatsFields();
        
        /// <summary>
        /// Gets questions with ALL their risk levels for a client
        /// </summary>
        Task<List<QuestionWithRiskLevelsDto>> GetQuestionsWithRiskLevelsAsync(int clientId);
    }
}
