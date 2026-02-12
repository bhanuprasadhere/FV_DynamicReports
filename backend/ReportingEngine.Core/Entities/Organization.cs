using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReportingEngine.Core.Entities
{
    [Table("Organizations")]
    public class Organization
    {
        [Key]
        [Column("OrganizationID")]
        public long OrganizationId { get; set; }

        [Column("Name")]
        [MaxLength(200)]
        public string Name { get; set; } = string.Empty;

        [Column("Address1")]
        [MaxLength(200)]
        public string? Address1 { get; set; }

        [Column("Address2")]
        [MaxLength(200)]
        public string? Address2 { get; set; }

        [Column("Address3")]
        [MaxLength(200)]
        public string? Address3 { get; set; }

        [Column("City")]
        [MaxLength(200)]
        public string? City { get; set; }

        [Column("State")]
        [MaxLength(200)]
        public string? State { get; set; }

        [Column("Zip")]
        [MaxLength(20)]
        public string? Zip { get; set; }

        [Column("Country")]
        [MaxLength(100)]
        public string? Country { get; set; }

        [Column("PhoneNumber")]
        [MaxLength(100)]
        public string? PhoneNumber { get; set; }

        [Column("FaxNumber")]
        [MaxLength(100)]
        public string? FaxNumber { get; set; }

        [Column("WebsiteURL")]
        [MaxLength(200)]
        public string? WebsiteURL { get; set; }

        [Column("OrganizationType")]
        [MaxLength(50)]
        public string? OrganizationType { get; set; }

        [Column("InsertDateTime")]
        public DateTime? InsertDateTime { get; set; }

        [Column("UpdateDateTime")]
        public DateTime? UpdateDateTime { get; set; }

        // Navigation properties
        public virtual ICollection<ClientTemplate> ClientTemplates { get; set; } = new List<ClientTemplate>();
    }
}