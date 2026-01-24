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

        [Column("SectionName")]
        public string? Name { get; set; } // Changed to string? (Nullable)

        [Column("DisplayOrder")]
        public int Order { get; set; }

        [Column("TemplateID")]
        public Guid TemplateId { get; set; }

        [ForeignKey("TemplateId")]
        public virtual Template? Template { get; set; }
    }
}