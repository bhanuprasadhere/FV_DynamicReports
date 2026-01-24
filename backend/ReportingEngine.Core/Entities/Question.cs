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

        [Column("QuestionText")]
        public string? Text { get; set; }

        [Column("SubSectionId")]
        public long TemplateSubSectionId { get; set; }

        [Column("DisplayOrder")]
        public int OrderNumber { get; set; }

        [Column("Visible")]
        public bool IsActive { get; set; }

        // FIX: Changed to bool? because DB allows NULL
        public bool? IsMandatory { get; set; }

        public long? QuestionBankId { get; set; }

        // --- Not Mapped ---
        [NotMapped] public string? Category { get; set; }
        [NotMapped] public string? DataType { get; set; }
        [NotMapped] public string? Description { get; set; }
        [NotMapped] public string? RiskLevel { get; set; }
        [NotMapped] public string? SafetyLevel { get; set; }

        [ForeignKey("TemplateSubSectionId")]
        public virtual TemplateSubSection? TemplateSubSection { get; set; }
    }
}