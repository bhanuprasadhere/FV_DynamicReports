using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.Entities;

namespace ReportingEngine.Infrastructure.Data;

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

        // Organization
        modelBuilder.Entity<Organization>()
            .HasKey(o => o.OrganizationId);
        modelBuilder.Entity<Organization>()
            .Property(o => o.Name)
            .IsRequired()
            .HasMaxLength(255);

        // ClientTemplate
        modelBuilder.Entity<ClientTemplate>()
            .HasKey(ct => ct.ClientTemplateId);
        modelBuilder.Entity<ClientTemplate>()
            .HasOne(ct => ct.Organization)
            .WithMany(o => o.ClientTemplates)
            .HasForeignKey(ct => ct.OrganizationId);
        modelBuilder.Entity<ClientTemplate>()
            .HasOne(ct => ct.Template)
            .WithMany(t => t.ClientTemplates)
            .HasForeignKey(ct => ct.TemplateId);

        // Template
        modelBuilder.Entity<Template>()
            .HasKey(t => t.TemplateId);
        modelBuilder.Entity<Template>()
            .Property(t => t.Name)
            .IsRequired()
            .HasMaxLength(255);

        // TemplateSection
        modelBuilder.Entity<TemplateSection>()
            .HasKey(ts => ts.TemplateSectionId);
        modelBuilder.Entity<TemplateSection>()
            .HasOne(ts => ts.Template)
            .WithMany(t => t.Sections)
            .HasForeignKey(ts => ts.TemplateId);
        modelBuilder.Entity<TemplateSection>()
            .Property(ts => ts.Name)
            .IsRequired()
            .HasMaxLength(255);

        // TemplateSubSection
        modelBuilder.Entity<TemplateSubSection>()
            .HasKey(tss => tss.TemplateSubSectionId);
        modelBuilder.Entity<TemplateSubSection>()
            .HasOne(tss => tss.Section)
            .WithMany(ts => ts.SubSections)
            .HasForeignKey(tss => tss.TemplateSectionId);
        modelBuilder.Entity<TemplateSubSection>()
            .Property(tss => tss.Name)
            .IsRequired()
            .HasMaxLength(255);

        // Question
        modelBuilder.Entity<Question>()
            .HasKey(q => q.QuestionId);
        modelBuilder.Entity<Question>()
            .HasOne(q => q.SubSection)
            .WithMany(tss => tss.Questions)
            .HasForeignKey(q => q.TemplateSubSectionId);
        modelBuilder.Entity<Question>()
            .Property(q => q.Text)
            .IsRequired();
        modelBuilder.Entity<Question>()
            .Property(q => q.DataType)
            .IsRequired()
            .HasMaxLength(50);
    }
}
