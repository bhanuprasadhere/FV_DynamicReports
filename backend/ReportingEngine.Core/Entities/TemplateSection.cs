using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ReportingEngine.Core.Entities
{
    public class TemplateSection
    {
        [Key]
        public int TemplateSectionId { get; set; }

        // FIX: Must match Template.TemplateId (Guid)
        public Guid TemplateId { get; set; }

        public string Name { get; set; } = string.Empty;
        public int Order { get; set; }

        // Navigation
        public virtual Template Template { get; set; } = null!;
        public ICollection<TemplateSubSection> SubSections { get; set; } = new List<TemplateSubSection>();
    }
}