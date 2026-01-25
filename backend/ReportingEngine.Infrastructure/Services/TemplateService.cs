using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.Infrastructure.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly ReportingDbContext _context;

        public TemplateService(ReportingDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuestionDto>> GetQuestionsForClientAsync(long clientId)
        {
            // 1. Get all questions for client's prequalification templates (DisplayOrder = 1 only)
            var questions = await _context.Questions
                .Where(q => q.TemplateSubSection != null
                         && q.TemplateSubSection.TemplateSection != null
                         && q.TemplateSubSection.TemplateSection.Template != null
                         && q.TemplateSubSection.TemplateSection.Template.ClientTemplates
                             .Any(ct => ct.OrganizationId == clientId 
                                     && ct.DisplayOrder == 1  // ONLY Prequalification templates
                                     && ct.Visible))
                .Select(q => new 
                {
                    q.QuestionId,
                    Text = q.Text ?? string.Empty,
                    q.QuestionBankId,
                    RiskLevel = q.TemplateSubSection!.TemplateSection!.Template!.RiskLevel,
                    q.OrderNumber,
                    q.IsMandatory
                })
                .ToListAsync();

            // 2. Group by QuestionBankId to identify duplicates
            var deduplicated = questions
                .GroupBy(q => q.QuestionBankId)
                .Select(g => new QuestionDto
                {
                    Id = (int)g.First().QuestionId,
                    Text = g.First().Text,
                    QuestionBankId = g.Key,
                    IsDuplicate = g.Count() > 1,
                    // Only show RiskLevel if question is unique (not duplicate)
                    RiskLevel = g.Count() == 1 ? g.First().RiskLevel : null,
                    Order = g.First().OrderNumber,
                    
                    // Legacy fields for backward compatibility
                    Type = "text",
                    Category = "General",
                    Required = g.First().IsMandatory ?? false,
                    SubSectionId = 0,
                    SectionId = 0,
                    TemplateId = string.Empty
                })
                .OrderBy(q => q.Order)
                .ToList();

            return deduplicated;
        }
    }
}