namespace ReportingEngine.Core.DTOs;

public class QuestionDto
{
    public int Id { get; set; }
    public string Text { get; set; } = string.Empty;

    // Updated to match Service: 'Type' instead of 'DataType'
    public string Type { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    // Updated to match Service: 'Required' instead of 'IsMandatory'
    public bool Required { get; set; }

    // Added to match Service
    public int Order { get; set; }

    // Added Hierarchy IDs required by Service
    public int SectionId { get; set; }
    public int SubSectionId { get; set; }
    public string TemplateId { get; set; } = string.Empty;

    // Optional metadata
    public string? Description { get; set; }
}