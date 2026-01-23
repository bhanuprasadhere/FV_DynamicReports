using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("ClientTemplates")]
    public class ClientTemplate
    {
        [Key]
        public Guid ClientTemplateId { get; set; }

        // --- MAPPING FIX ---
        // Maps C# "OrganizationId" to SQL "ClientID"
        [Column("ClientID")]
        public long OrganizationId { get; set; }
        // -------------------

        public Guid TemplateId { get; set; }

        public int DisplayOrder { get; set; }

        public bool Visible { get; set; }

        public bool DefaultTemplate { get; set; }

        public DateTime? DeletedOn { get; set; }

        public Guid? DeletedBy { get; set; }

        // --- ADD THESE MISSING NAVIGATION PROPERTIES ---
        // These allow the DbContext to link this table to the others

        [ForeignKey("OrganizationId")]
        public virtual Organization? Organization { get; set; }

        [ForeignKey("TemplateId")]
        public virtual Template? Template { get; set; }
    }
}