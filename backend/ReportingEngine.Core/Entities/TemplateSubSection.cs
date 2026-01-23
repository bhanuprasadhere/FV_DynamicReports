using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("TemplateSubSections")]
    public class TemplateSubSection
    {
        [Key]
        [Column("SubSectionID")]
        public long TemplateSubSectionId { get; set; }

        [Column("SubSectionName")] // Maps "Name" to "SubSectionName"
        public string Name { get; set; } = string.Empty;

        [Column("DisplayOrder")] // Maps "OrderNumber" to "DisplayOrder"
        public int OrderNumber { get; set; }

        [Column("Visible")] // Maps "IsActive" to "Visible"
        public bool IsActive { get; set; }

        [Column("TemplateSectionID")]
        public long TemplateSectionId { get; set; }

        // --- Navigation Properties ---
        [ForeignKey("TemplateSectionId")]
        public virtual TemplateSection? TemplateSection { get; set; }
    }
}