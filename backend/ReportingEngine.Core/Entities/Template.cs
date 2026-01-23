using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReportingEngine.Core.Entities
{
    public class Template
    {
        [Key]
        // FIX: Database uses GUID (821ABF8C-...), so this must be Guid
        public Guid TemplateId { get; set; }

        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int Version { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }

        // Navigation
        public ICollection<ClientTemplate> ClientTemplates { get; set; } = new List<ClientTemplate>();
        public ICollection<TemplateSection> Sections { get; set; } = new List<TemplateSection>();
    }
}