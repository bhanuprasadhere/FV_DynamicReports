using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    public class ClientTemplate
    {
        [Key]
        public int ClientTemplateId { get; set; }

        // FIX 1: OrganizationId is bigint in DB -> long in C#
        public long OrganizationId { get; set; }

        // FIX 2: TemplateId is uniqueidentifier in DB -> Guid in C#
        public Guid TemplateId { get; set; }

        public bool IsActive { get; set; }

        // FIX 3: Restored Navigation Properties (Solves the "Definition not found" error)
        [ForeignKey("OrganizationId")]
        public virtual Organization Organization { get; set; } = null!;

        [ForeignKey("TemplateId")]
        public virtual Template Template { get; set; } = null!;
    }
}