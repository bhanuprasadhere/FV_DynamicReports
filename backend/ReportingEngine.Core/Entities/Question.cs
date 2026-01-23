using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("Questions")]
    public class Question
    {
        [Key]
        [Column("QuestionID")]
        public long QuestionId { get; set; }

        [Column("QuestionText")] // Maps "Text" to "QuestionText"
        public string Text { get; set; } = string.Empty;

        [Column("SubSectionId")] // Maps "TemplateSubSectionId" to "SubSectionId"
        public long TemplateSubSectionId { get; set; }

        [Column("DisplayOrder")] // Maps "OrderNumber" to "DisplayOrder"
        public int OrderNumber { get; set; }

        [Column("Visible")] // Maps "IsActive" to "Visible"
        public bool IsActive { get; set; }

        public bool IsMandatory { get; set; }

        public long? QuestionBankId { get; set; }

        // --- PROPERTIES NOT IN DATABASE (Marked as NotMapped to prevent crash) ---
        [NotMapped]
        public string? Category { get; set; }
        [NotMapped]
        public string? DataType { get; set; }
        [NotMapped]
        public string? Description { get; set; }
        [NotMapped]
        public string? RiskLevel { get; set; }
        [NotMapped]
        public string? SafetyLevel { get; set; }

        // --- Navigation Property ---
        [ForeignKey("TemplateSubSectionId")]
        public virtual TemplateSubSection? TemplateSubSection { get; set; }
    }
}