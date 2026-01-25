namespace ReportingEngine.Core.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;
    public long? QuestionBankId { get; set; }
    public string? RiskLevel { get; set; }  // Only populated for unique questions
    public bool IsDuplicate { get; set; }   // True if QuestionBankId appears multiple times
    
    // Metadata
    public int Order { get; set; }
    public string? Description { get; set; }
    
    // Legacy fields (kept for backward compatibility with existing drag-and-drop UI)
    public string Type { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public bool Required { get; set; }
    public int SectionId { get; set; }
    public int SubSectionId { get; set; }
    public string TemplateId { get; set; } = string.Empty;
}