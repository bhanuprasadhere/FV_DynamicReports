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

            // 2. Fetch only necessary columns using Projection (.Select)
            // This prevents fetching the entire tables and large text fields
            var questionDtos = await _context.Questions
                .Where(q => q.TemplateSubSection != null
                         && q.TemplateSubSection.TemplateSection != null
                         && templateIds.Contains(q.TemplateSubSection.TemplateSection.TemplateId))
                .Select(q => new QuestionDto
                {
                    Id = (int)q.QuestionId,
                    Text = q.Text ?? string.Empty,
                    Type = "text",
                    Category = "General",

                    // Handle Nullable Boolean safely
                    Required = q.IsMandatory ?? false,

                    Order = q.OrderNumber,

                    // Select IDs directly. EF Core generates efficient JOINS for these.
                    // We use null-coalescing (?? 0) to handle potential nulls safely in C#
                    SectionId = (int)(q.TemplateSubSection != null && q.TemplateSubSection.TemplateSection != null
                        ? q.TemplateSubSection.TemplateSection.TemplateSectionId
                        : 0),

                    SubSectionId = (int)q.TemplateSubSectionId,

                    TemplateId = (q.TemplateSubSection != null && q.TemplateSubSection.TemplateSection != null)
                        ? q.TemplateSubSection.TemplateSection.TemplateId.ToString()
                        : string.Empty
                })
                .ToListAsync();

            return questionDtos;
        }
    }
}