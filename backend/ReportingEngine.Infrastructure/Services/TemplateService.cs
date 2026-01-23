using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReportingEngine.Infrastructure.Services
{
    public class TemplateService : ITemplateService
    {
        private readonly ReportingDbContext _context;

        public TemplateService(ReportingDbContext context)
        {
            _context = context;
        }

        public async Task<List<QuestionDto>> GetQuestionsForClientAsync(int clientId)
        {
            // 1. Get the Template IDs for this client
            // FIX: Changed ct.ClientId to ct.OrganizationId based on your entity definition
            var templateIds = await _context.ClientTemplates
                .Where(ct => ct.OrganizationId == clientId)
                .Select(ct => ct.TemplateId)
                .ToListAsync();

            // 2. Fetch the full hierarchy
            var questions = await _context.Questions
                .Include(q => q.SubSection)
                .ThenInclude(ss => ss.Section)
                .ThenInclude(s => s.Template)
                .Where(q => templateIds.Contains(q.SubSection.Section.TemplateId))
                .ToListAsync();

            // 3. Apply the "Manager's Rule" (Grouping)
            var finalQuestions = new List<QuestionDto>();

            var grouped = questions.GroupBy(q => q.QuestionBankId);

            foreach (var group in grouped)
            {
                // Group Key can be null if QuestionBankId is nullable
                if (group.Key != null && group.Key != 0)
                {
                    // Case 1: Same QuestionBankId -> Take the FIRST one (Distinct)
                    var distinctQ = group.First();
                    finalQuestions.Add(MapToDto(distinctQ));
                }
                else
                {
                    // Case 2: No QuestionBankId (or 0/null) -> Take ALL of them
                    foreach (var q in group)
                    {
                        finalQuestions.Add(MapToDto(q));
                    }
                }
            }

            return finalQuestions;
        }

        private QuestionDto MapToDto(ReportingEngine.Core.Entities.Question q)
        {
            // Safely handle null navigation properties just in case
            string category = q.SubSection?.Section?.Name ?? "General";

            return new QuestionDto
            {
                Id = q.QuestionId,

                // FIX: Changed q.QuestionText to q.Text based on your entity definition
                Text = q.Text,

                // FIX: Changed q.QuestionType to q.DataType based on your entity definition
                DataType = q.DataType,

                SectionName = category
            };
        }
    }
}