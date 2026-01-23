using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Entities;

namespace ReportingEngine.Infrastructure.Data
{
    public class ReportingDbContext : DbContext
    {
        public ReportingDbContext(DbContextOptions<ReportingDbContext> options) : base(options)
        {
        }

        public DbSet<Organization> Organizations { get; set; }
        public DbSet<ClientTemplate> ClientTemplates { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TemplateSection> TemplateSections { get; set; }
        public DbSet<TemplateSubSection> TemplateSubSections { get; set; }
        public DbSet<Question> Questions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure ClientTemplate -> Organization
            modelBuilder.Entity<ClientTemplate>()
                .HasOne(ct => ct.Organization)
                .WithMany()
                .HasForeignKey(ct => ct.OrganizationId);

            // Configure ClientTemplate -> Template
            modelBuilder.Entity<ClientTemplate>()
                .HasOne(ct => ct.Template)
                .WithMany(t => t.ClientTemplates)
                .HasForeignKey(ct => ct.TemplateId);

            // Configure TemplateSection -> Template
            modelBuilder.Entity<TemplateSection>()
                .HasOne(ts => ts.Template)
                .WithMany(t => t.Sections)
                .HasForeignKey(ts => ts.TemplateId);

            // Configure TemplateSubSection -> TemplateSection
            modelBuilder.Entity<TemplateSubSection>()
                .HasOne(tss => tss.TemplateSection)
                .WithMany()
                .HasForeignKey(tss => tss.TemplateSectionId);

            // Configure Question -> TemplateSubSection
            modelBuilder.Entity<Question>()
                .HasOne(q => q.TemplateSubSection) // Corrected Name
                .WithMany()
                .HasForeignKey(q => q.TemplateSubSectionId);
        }
    }
}