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
        // Step 1: Fetch the hierarchy with eager loading
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

        // Step 2: Get all active questions
        var allQuestions = template.Sections
            .Where(s => s.IsActive)
            .SelectMany(s => s.SubSections)
            .Where(ss => ss.IsActive)
            .SelectMany(ss => ss.Questions)
            .Where(q => q.IsActive)
            .ToList();

        // Step 3: Get DISTINCT questions by QuestionBankId
        // Group by QuestionBankId (or negative QuestionId for ungrouped questions)
        var distinctGroups = allQuestions
            .GroupBy(q => q.QuestionBankId ?? (-q.QuestionId)) // Use negative ID as unique identifier for null banks
            .ToList();

        // Step 4: Build DTO for each distinct question
        foreach (var group in distinctGroups)
        {
            var question = group.First(); // Take first from group (they're the same question)

            // Get the section information
            var section = template.Sections
                .SelectMany(s => s.SubSections)
                .FirstOrDefault(ss => ss.TemplateSubSectionId == question.TemplateSubSectionId)
                ?.Section;

            var questionDto = new QuestionDto
            {
                Id = question.QuestionId,
                Text = question.Text,
                DataType = question.DataType,
                SectionName = section?.Name ?? "Unknown Section",
                Category = question.Category ?? section?.Name ?? "General",
                RiskLevel = question.RiskLevel,
                SafetyLevel = question.SafetyLevel,
                IsMandatory = question.IsMandatory,
                Description = question.Description,
                QuestionBankId = question.QuestionBankId
            };

            questions.Add(questionDto);
        }

        // Sort by section and order number
        return questions.OrderBy(q => q.SectionName).ThenBy(q => q.Id).ToList();
    }
}
