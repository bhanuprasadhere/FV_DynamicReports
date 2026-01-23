using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("TemplateSections")]
    public class TemplateSection
    {
        [Key]
        [Column("TemplateSectionID")]
        public long TemplateSectionId { get; set; }

        [Column("SectionName")] // Maps "Name" to "SectionName"
        public string Name { get; set; } = string.Empty;

        [Column("DisplayOrder")] // Maps "Order" to "DisplayOrder"
        public int Order { get; set; }

        [Column("TemplateID")]
        public Guid TemplateId { get; set; }

        // --- Navigation Properties ---
        [ForeignKey("TemplateId")]
        public virtual Template? Template { get; set; }
    }
}