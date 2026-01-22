namespace ReportingEngine.Core.Entities;

public class TemplateSection
{
    public int TemplateSectionId { get; set; }
    public int TemplateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public int OrderNumber { get; set; }
    public bool IsActive { get; set; }

    // Navigation
    public Template Template { get; set; } = null!;
    public ICollection<TemplateSubSection> SubSections { get; set; } = new List<TemplateSubSection>();
}
