using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("Templates")]
    public class Template
    {
        [Key]
        [Column("TemplateID")]
        public Guid TemplateId { get; set; }

        [Column("TemplateName")]
        public string Name { get; set; } = string.Empty;

        [Column("TemplateNotes")]
        public string? Description { get; set; }

        // --- Collections required by DbContext ---
        public virtual ICollection<TemplateSection> Sections { get; set; } = new List<TemplateSection>();
        public virtual ICollection<ClientTemplate> ClientTemplates { get; set; } = new List<ClientTemplate>();

        // --- Not Mapped Properties ---
        [NotMapped]
        public DateTime CreatedDate { get; set; }
        [NotMapped]
        public bool IsActive { get; set; } = true;
        [NotMapped]
        public string? Version { get; set; }
    }
}