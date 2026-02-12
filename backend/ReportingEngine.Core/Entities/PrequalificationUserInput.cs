using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("PrequalificationUserInput")]
    public class PrequalificationUserInput
    {
        [Key]
        [Column("PreQualRecId")]
        public long PreQualRecId { get; set; }

        [Column("PreQualificationId")]
        public long PreQualificationId { get; set; }

        [Column("QuestionColumnId")]
        public long QuestionColumnId { get; set; }

        [Column("UserInput")]
        [MaxLength(3500)]
        public string? UserInput { get; set; }

        [Column("DeletedOn")]
        public DateTime? DeletedOn { get; set; }

        [Column("DeletedBy")]
        public Guid? DeletedBy { get; set; }

        // Navigation properties
        [ForeignKey("PreQualificationId")]
        public virtual Prequalification? Prequalification { get; set; }
    }
}
