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

    // Navigation
    public TemplateSubSection SubSection { get; set; } = null!;
}
