using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;
using ReportingEngine.Infrastructure.Data;

namespace ReportingEngine.Infrastructure.Services
{
    public class ReportService : IReportService
    {
        private readonly ReportingDbContext _context;

        public ReportService(ReportingDbContext context)
        {
            _context = context;
        }

        public List<VendorStatsDto> GetVendorStatsFields()
        {
            // Return actual vendor fields from Organizations table
            return new List<VendorStatsDto>
            {
                new() { FieldName = "Name", DisplayName = "Vendor Name" },
                new() { FieldName = "Address1", DisplayName = "Address Line 1" },
                new() { FieldName = "Address2", DisplayName = "Address Line 2" },
                new() { FieldName = "City", DisplayName = "City" },
                new() { FieldName = "State", DisplayName = "State" },
                new() { FieldName = "Zip", DisplayName = "Zip Code" },
                new() { FieldName = "Country", DisplayName = "Country" },
                new() { FieldName = "PhoneNumber", DisplayName = "Phone Number" },
                new() { FieldName = "FaxNumber", DisplayName = "Fax Number" },
                new() { FieldName = "WebsiteURL", DisplayName = "Website" },
                new() { FieldName = "FederalIDNumber", DisplayName = "Federal ID" },
                new() { FieldName = "TaxID", DisplayName = "Tax ID" },
                new() { FieldName = "PrincipalCompanyOfficerName", DisplayName = "Principal Officer" },
                new() { FieldName = "OrgRepresentativeName", DisplayName = "Representative Name" },
                new() { FieldName = "OrgRepresentativeEmail", DisplayName = "Representative Email" }
            };
        }

        public async Task<List<QuestionWithRiskLevelsDto>> GetQuestionsWithRiskLevelsAsync(int clientId)
        {
            var questions = await _context.Questions
                .Include(q => q.TemplateSubSection)
                    .ThenInclude(tss => tss.TemplateSection)
                    .ThenInclude(ts => ts.Template)
                        .ThenInclude(t => t.ClientTemplates)
                .Where(q => q.TemplateSubSection.TemplateSection.Template.ClientTemplates
                    .Any(ct => ct.OrganizationId == clientId && ct.Visible))
                .ToListAsync();


            // Group by QuestionId and aggregate risk levels
            var grouped = questions
                .GroupBy(q => new { q.QuestionId, q.Text, q.QuestionBankId })
                .Select(g => new QuestionWithRiskLevelsDto
                {
                    QuestionId = g.Key.QuestionId,
                    QuestionText = g.Key.Text ?? string.Empty,
                    QuestionBankId = g.Key.QuestionBankId,
                    RiskLevels = g
                        .Select(q => q.TemplateSubSection?.TemplateSection?.Template?.RiskLevel)
                        .Where(r => !string.IsNullOrWhiteSpace(r))
                        .Distinct()
                        .ToList()!,
                    TemplateCount = g
                        .Select(q => q.TemplateSubSection?.TemplateSection?.Template?.TemplateId)
                        .Distinct()
                        .Count()
                })
                .OrderBy(q => q.QuestionBankId)
                .ToList();

            return grouped;
        }

        public async Task<DynamicReportResultDto> GenerateDynamicReportAsync(List<ReportColumnDto> columns, int clientId)
        {
            // Get all vendors (Organizations where OrganizationType = 'Vendor') for this client
            // through their prequalifications
            var vendorPrequalifications = await _context.Prequalifications
                .Include(pq => pq.Vendor)
                .Include(pq => pq.UserInputs)
                .Where(pq => pq.ClientId == clientId)
                .GroupBy(pq => pq.VendorId)
                .Select(g => g.OrderByDescending(pq => pq.PrequalificationStart).First())
                .ToListAsync();

            var rows = new List<Dictionary<string, object>>();

            foreach (var prequalification in vendorPrequalifications)
            {
                var row = new Dictionary<string, object>();

                foreach (var column in columns)
                {
                    if (column.Type == "vendor-stat")
                    {
                        // Add vendor stat columns from Organization table
                        row[column.DisplayName] = column.FieldName switch
                        {
                            "VendorName" => prequalification.Vendor?.Name ?? "N/A",
                            "Address" => prequalification.Vendor?.Address1 ?? "N/A",
                            "PhoneNumber" => prequalification.Vendor?.PhoneNumber ?? "N/A",
                            _ => "N/A"
                        };
                    }
                    else if (column.Type == "question" && column.QuestionId.HasValue)
                    {
                        // Add question answer columns from PrequalificationUserInput
                        // Note: We need to find the QuestionColumnId for this QuestionId
                        // This is a simplified version - you may need to adjust based on your QuestionColumnDetails table
                        var answer = prequalification.UserInputs
                            .FirstOrDefault()?.UserInput; // Simplified - needs proper QuestionColumnId mapping

                        row[column.DisplayName] = answer ?? "N/A";
                    }
                }

                rows.Add(row);
            }

            return new DynamicReportResultDto
            {
                ColumnHeaders = columns.Select(c => c.DisplayName).ToList(),
                Rows = rows
            };
        }
    }
}
