using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using ClosedXML.Excel;
using ReportingEngine.Core.DTOs;
using ReportingEngine.Core.Interfaces;

namespace ReportingEngine.Infrastructure.Services
{
    public class ExcelExportService : IExcelExportService
    {
        public Task<byte[]> GenerateExcelAsync(DynamicReportResultDto reportData, string fileName = "Report")
        {
            using var workbook = new XLWorkbook();
            var worksheet = workbook.Worksheets.Add(fileName);

            // Add headers
            for (int i = 0; i < reportData.ColumnHeaders.Count; i++)
            {
                var cell = worksheet.Cell(1, i + 1);
                cell.Value = reportData.ColumnHeaders[i];
                cell.Style.Font.Bold = true;
                cell.Style.Fill.BackgroundColor = XLColor.LightGray;
                cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            }

            // Add data rows
            for (int rowIndex = 0; rowIndex < reportData.Rows.Count; rowIndex++)
            {
                var row = reportData.Rows[rowIndex];
                for (int colIndex = 0; colIndex < reportData.ColumnHeaders.Count; colIndex++)
                {
                    var header = reportData.ColumnHeaders[colIndex];
                    var cell = worksheet.Cell(rowIndex + 2, colIndex + 1);
                    
                    if (row.TryGetValue(header, out var value))
                    {
                        cell.Value = value?.ToString() ?? "";
                    }
                    
                    cell.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
                }
            }

            // Auto-fit columns
            worksheet.Columns().AdjustToContents();

            // Save to memory stream
            using var stream = new MemoryStream();
            workbook.SaveAs(stream);
            return Task.FromResult(stream.ToArray());
        }
    }
}
