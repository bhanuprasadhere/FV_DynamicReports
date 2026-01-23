namespace ReportingEngine.Core.Entities;

public class Question
{
    public int QuestionId { get; set; }
    public int TemplateSubSectionId { get; set; }
    public string Text { get; set; } = string.Empty;
    public string DataType { get; set; } = string.Empty;
    public int? QuestionBankId { get; set; }
    public bool IsActive { get; set; }
    public int OrderNumber { get; set; }

    // Metadata fields
    public string? RiskLevel { get; set; } // "Low", "Medium", "High", "Critical"
    public string? SafetyLevel { get; set; } // "Safe", "Warning", "Dangerous"
    public string? Category { get; set; } // Question category/classification
    public bool IsMandatory { get; set; } = false;
    public string? Description { get; set; } // Additional context

    // Navigation
    public TemplateSubSection SubSection { get; set; } = null!;
}

