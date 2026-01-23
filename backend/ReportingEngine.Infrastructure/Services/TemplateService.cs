using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;
using System;
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

        public async Task<List<QuestionDto>> GetQuestionsForClientAsync(long clientId)
        {
            // 1. Get Template IDs (GUIDs) linked to the Client
            var templateIds = await _context.ClientTemplates
                .Where(ct => ct.OrganizationId == clientId)
                .Select(ct => ct.TemplateId)
                .ToListAsync();

            if (!templateIds.Any())
                return new List<QuestionDto>();

            // 2. Fetch Questions linked to these GUID Templates
            var questions = await _context.Questions
                .Include(q => q.SubSection)
                .ThenInclude(ss => ss.Section)
                .ThenInclude(s => s.Template)
                .Where(q => templateIds.Contains(q.SubSection.Section.TemplateId))
                .ToListAsync();

            // 3. Grouping Logic
            var finalQuestions = new List<QuestionDto>();

            // Group by QuestionBankId (which is an int?)
            var grouped = questions.GroupBy(q => q.QuestionBankId);

            foreach (var group in grouped)
            {
                // FIX: QuestionBankId is int?, so we check if it is not null and not 0
                if (group.Key != null && group.Key != 0)
                {
                    // Case 1: Shared ID -> Distinct (Take First)
                    var distinctQ = group.First();
                    finalQuestions.Add(MapToDto(distinctQ));
                }
                else
                {
                    // Case 2: Null or 0 ID -> Unique (Take All)
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
            // Handle potentially null navigation properties safely
            string category = q.SubSection?.Section?.Name ?? "General";

            return new QuestionDto
            {
                Id = q.QuestionId,
                Text = q.Text,
                DataType = q.DataType,
                SectionName = category
            };
        }
    }
}