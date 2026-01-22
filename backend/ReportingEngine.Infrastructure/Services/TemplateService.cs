using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.Infrastructure.Services;

public class TemplateService : ITemplateService
{
    private readonly ReportingDbContext _context;

    public TemplateService(ReportingDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuestionDto>> GetQuestionsForClientAsync(int clientId)
    {
        // Step 1: Fetch the hierarchy
        var clientTemplate = await _context.ClientTemplates
            .Where(ct => ct.OrganizationId == clientId && ct.IsActive)
            .Include(ct => ct.Template)
            .ThenInclude(t => t.Sections)
            .ThenInclude(ts => ts.SubSections)
            .ThenInclude(tss => tss.Questions)
            .FirstOrDefaultAsync();

        if (clientTemplate == null)
            return new List<QuestionDto>();

        var questions = new List<QuestionDto>();
        var template = clientTemplate.Template;

        // Step 2: Flatten and group questions by QuestionBankId
        var allQuestions = template.Sections
            .Where(s => s.IsActive)
            .SelectMany(s => s.SubSections)
            .Where(ss => ss.IsActive)
            .SelectMany(ss => ss.Questions)
            .Where(q => q.IsActive)
            .ToList();

        // Step 3: Apply the grouping logic
        var questionsByBank = allQuestions
            .GroupBy(q => q.QuestionBankId ?? -q.QuestionId) // Use negative ID as unique identifier for null banks
            .ToList();

        foreach (var group in questionsByBank)
        {
            var question = @group.First(); // Select the first question in the group (Distinct)
            var section = template.Sections
                .SelectMany(s => s.SubSections)
                .First(ss => ss.TemplateSubSectionId == question.TemplateSubSectionId)
                .Section;

            questions.Add(new QuestionDto
            {
                Id = question.QuestionId,
                Text = question.Text,
                DataType = question.DataType,
                SectionName = section.Name,
                Category = section.Name // Use Section name as category
            });
        }

        return questions;
    }
}
