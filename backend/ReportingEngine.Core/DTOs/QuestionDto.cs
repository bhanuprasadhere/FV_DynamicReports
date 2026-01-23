namespace ReportingEngine.Core.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
    public string SectionName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;

    // Metadata
    public string? RiskLevel { get; set; }
    public string? SafetyLevel { get; set; }
    public bool IsMandatory { get; set; }
    public string? Description { get; set; }

    // For distinct grouping
    public int? QuestionBankId { get; set; }
}