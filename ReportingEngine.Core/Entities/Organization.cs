namespace ReportingEngine.Core.Entities;

public class Organization
{
    public int OrganizationId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTime CreatedDate { get; set; }
    public DateTime? ModifiedDate { get; set; }

    // Navigation
    public ICollection<ClientTemplate> ClientTemplates { get; set; } = new List<ClientTemplate>();
}
