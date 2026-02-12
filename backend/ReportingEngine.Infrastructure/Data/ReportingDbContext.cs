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
        public DbSet<Prequalification> Prequalifications { get; set; }
        public DbSet<PrequalificationUserInput> PrequalificationUserInputs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // NOTE: ClientTemplate relationships are configured via [ForeignKey] attributes
            // Removing explicit configuration here to avoid shadow property conflicts

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
                .HasOne(q => q.TemplateSubSection)
                .WithMany()
                .HasForeignKey(q => q.TemplateSubSectionId);

            // Configure Prequalification -> Vendor (Organization)
            modelBuilder.Entity<Prequalification>()
                .HasOne(pq => pq.Vendor)
                .WithMany()
                .HasForeignKey(pq => pq.VendorId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Prequalification -> Client (Organization)
            modelBuilder.Entity<Prequalification>()
                .HasOne(pq => pq.Client)
                .WithMany()
                .HasForeignKey(pq => pq.ClientId)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Prequalification -> ClientTemplate
            modelBuilder.Entity<Prequalification>()
                .HasOne(pq => pq.ClientTemplate)
                .WithMany()
                .HasForeignKey(pq => pq.ClientTemplateId);

            // Configure PrequalificationUserInput -> Prequalification
            modelBuilder.Entity<PrequalificationUserInput>()
                .HasOne(pui => pui.Prequalification)
                .WithMany(pq => pq.UserInputs)
                .HasForeignKey(pui => pui.PreQualificationId);
        }
    }
}
