namespace ReportingEngine.Core.Entities;

public class ClientTemplate
{
    public int ClientTemplateId { get; set; }
    public int OrganizationId { get; set; }
    public int TemplateId { get; set; }
    public bool IsActive { get; set; }
    public DateTime AssignedDate { get; set; }

    // Navigation
    public Organization Organization { get; set; } = null!;
    public Template Template { get; set; } = null!;
}
