using ReportingEngine.Core.DTOs;

namespace ReportingEngine.Core.Interfaces;

public interface ITemplateService
{
    Task<List<QuestionDto>> GetQuestionsForClientAsync(int clientId);
}