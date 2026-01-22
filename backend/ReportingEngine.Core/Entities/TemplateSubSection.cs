namespace ReportingEngine.Core.Entities;

public class TemplateSubSection
{
    public int TemplateSubSectionId { get; set; }
    public int TemplateSectionId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public bool IsActive { get; set; }

    // Navigation
    public TemplateSection Section { get; set; } = null!;
    public ICollection<Question> Questions { get; set; } = new List<Question>();
}
