using System.Collections.Generic;

namespace ReportingEngine.Core.DTOs
{
    /// <summary>
    /// Represents a question with ALL its associated risk levels across templates
    /// </summary>
    public class QuestionWithRiskLevelsDto
    {
        public long QuestionId { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public long? QuestionBankId { get; set; }
        
        /// <summary>
        /// ALL risk levels this question appears in (e.g., ["Safety", "Low Risk", "Subcontractor"])
        /// </summary>
        public List<string> RiskLevels { get; set; } = new();
        
        /// <summary>
        /// Number of templates this question appears in
        /// </summary>
        public int TemplateCount { get; set; }
        
        public string DragType => "question";
    }
}
