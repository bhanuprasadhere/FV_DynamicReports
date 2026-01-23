using System.Collections.Generic;
using System.Threading.Tasks;
using ReportingEngine.Core.DTOs;

namespace ReportingEngine.Core.Interfaces
{
    public interface ITemplateService
    {
        Task<List<QuestionDto>> GetQuestionsForClientAsync(long clientId);
    }
}