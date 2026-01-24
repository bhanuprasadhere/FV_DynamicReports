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

        [Column("SubSectionName")]
        public string? Name { get; set; }

        [Column("DisplayOrder")]
        public int OrderNumber { get; set; }

        // FIX: Changed to bool? because DB allows NULL for 'Visible' column
        [Column("Visible")]
        public bool? IsActive { get; set; }

        [Column("TemplateSectionID")]
        public long TemplateSectionId { get; set; }

        [ForeignKey("TemplateSectionId")]
        public virtual TemplateSection? TemplateSection { get; set; }
    }
}