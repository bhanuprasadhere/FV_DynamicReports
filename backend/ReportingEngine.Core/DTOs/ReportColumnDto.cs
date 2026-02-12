namespace ReportingEngine.Core.DTOs
{
    /// <summary>
    /// Represents a column in the dynamic report (either vendor stat or question)
    /// </summary>
    public class ReportColumnDto
    {
        public string Type { get; set; } = string.Empty; // "vendor-stat" or "question"
        public long? QuestionId { get; set; }
        public string? FieldName { get; set; } // For vendor stats: "VendorName", "Address", etc.
        public string DisplayName { get; set; } = string.Empty;
    }
}
