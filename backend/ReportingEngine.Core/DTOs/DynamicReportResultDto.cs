using System.Collections.Generic;

namespace ReportingEngine.Core.DTOs
{
    /// <summary>
    /// Represents the result of a dynamically generated report
    /// </summary>
    public class DynamicReportResultDto
    {
        public List<string> ColumnHeaders { get; set; } = new();
        public List<Dictionary<string, object>> Rows { get; set; } = new();
        public int TotalRows => Rows.Count;
    }
}
