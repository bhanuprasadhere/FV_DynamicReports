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
            // 1. Get Template IDs for the client
            var templateIds = await _context.ClientTemplates
                .Where(c => c.OrganizationId == clientId)
                .Select(c => c.TemplateId)
                .ToListAsync();

            if (!templateIds.Any())
                return new List<QuestionDto>();

            // 2. Fetch questions using the CORRECT property names
            var questions = await _context.Questions
                .Include(q => q.TemplateSubSection)
                    .ThenInclude(ts => ts.TemplateSection)
                        .ThenInclude(s => s.Template)
                .Where(q => q.TemplateSubSection != null
                         && q.TemplateSubSection.TemplateSection != null
                         && templateIds.Contains(q.TemplateSubSection.TemplateSection.TemplateId))
                .ToListAsync();

            // 3. Map to DTO with Explicit Casting
            var questionDtos = questions.Select(q => new QuestionDto
            {
                Id = (int)q.QuestionId, // Cast long to int
                Text = q.Text,
                Type = "text", // Defaulting since DataType isn't in DB
                Category = "General", // Defaulting
                Required = q.IsMandatory,
                Order = q.OrderNumber,

                // Map Hierarchy IDs with Casting
                SectionId = (int)(q.TemplateSubSection?.TemplateSection?.TemplateSectionId ?? 0),
                SubSectionId = (int)(q.TemplateSubSectionId),
                TemplateId = q.TemplateSubSection?.TemplateSection?.TemplateId.ToString() ?? ""
            }).ToList();

            return questionDtos;
        }
    }
}