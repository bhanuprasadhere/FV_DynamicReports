using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("Prequalification")]
    public class Prequalification
    {
        [Key]
        [Column("PrequalificationId")]
        public long PrequalificationId { get; set; }

        [Column("VendorId")]
        public long VendorId { get; set; }

        [Column("ClientId")]
        public long ClientId { get; set; }

        [Column("PrequalificationStatusId")]
        public long PrequalificationStatusId { get; set; }

        [Column("ClientTemplateId")]
        public Guid? ClientTemplateId { get; set; }

        [Column("PrequalificationStart")]
        public DateTime PrequalificationStart { get; set; }

        [Column("PrequalificationFinish")]
        public DateTime PrequalificationFinish { get; set; }

        [Column("PrequalificationCreate")]
        public DateTime PrequalificationCreate { get; set; }

        // Navigation properties
        [ForeignKey("VendorId")]
        public virtual Organization? Vendor { get; set; }

        [ForeignKey("ClientId")]
        public virtual Organization? Client { get; set; }

        [ForeignKey("ClientTemplateId")]
        public virtual ClientTemplate? ClientTemplate { get; set; }

        public virtual ICollection<PrequalificationUserInput> UserInputs { get; set; } = new List<PrequalificationUserInput>();
    }
}
