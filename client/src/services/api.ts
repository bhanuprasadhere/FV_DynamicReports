import axios from 'axios';
import type { Client, Question, GroupedSchema, Template, Section, SubSection } from '@/types/report';

const BASE_URL = 'http://localhost:5008';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchClients = async (): Promise<Client[]> => {
  console.log('📡 API: Fetching clients from', `${BASE_URL}/api/reports/clients`);
  try {
    const response = await api.get<Client[]>('/api/reports/clients');
    console.log('📡 API: Response received', response);
    return response.data;
  } catch (error) {
    console.error('📡 API: Error fetching clients', error);
    throw error;
  }
};

export const fetchQuestions = async (organizationId: number): Promise<Question[]> => {
  const response = await api.get<Question[]>(`/api/reports/schema/${organizationId}`);
  return response.data;
};

// NEW: Fetch questions with ALL risk levels (for drag-drop report builder)
export const fetchQuestionsWithRiskLevels = async (clientId: number): Promise<Question[]> => {
  console.log('📡 API: Fetching questions with risk levels for client', clientId);
  try {
    const response = await api.get(`/api/reports/questions/${clientId}`);
    console.log('📡 API: Questions with risk levels received', response.data);

    // Transform backend DTO to frontend Question type
    return response.data.map((dto: any) => ({
      id: dto.questionId,
      text: dto.questionText,
      questionBankId: dto.questionBankId,
      riskLevels: dto.riskLevels || [],
      templateCount: dto.templateCount || 0,
      type: 'text', // Default values for required fields
      required: false,
      order: 0,
      sectionId: 0,
      subSectionId: 0,
      templateId: '',
    }));
  } catch (error) {
    console.error('📡 API: Error fetching questions with risk levels', error);
    throw error;
  }
};

// NEW: Fetch vendor stats fields (for drag-drop report builder)
export const fetchVendorStats = async (): Promise<{ fieldName: string; displayName: string }[]> => {
  console.log('📡 API: Fetching vendor stats fields');
  try {
    const response = await api.get('/api/vendors/stats');
    console.log('📡 API: Vendor stats received', response.data);
    return response.data;
  } catch (error) {
    console.error('📡 API: Error fetching vendor stats', error);
    throw error;
  }
};


/**
 * Transform flat question list into hierarchical structure
 * Hierarchy: TemplateId -> SectionId -> SubSectionId -> Questions
 */
export const groupQuestions = (questions: Question[]): GroupedSchema => {
  const templateMap = new Map<string, Map<number, Map<number, Question[]>>>();
  const sectionIds = new Set<number>();

  // Sort questions by order first
  const sortedQuestions = [...questions].sort((a, b) => a.order - b.order);

  // Group questions hierarchically
  for (const question of sortedQuestions) {
    const { templateId, sectionId, subSectionId } = question;

    sectionIds.add(sectionId);

    if (!templateMap.has(templateId)) {
      templateMap.set(templateId, new Map());
    }

    const sectionMap = templateMap.get(templateId)!;
    if (!sectionMap.has(sectionId)) {
      sectionMap.set(sectionId, new Map());
    }

    const subSectionMap = sectionMap.get(sectionId)!;
    if (!subSectionMap.has(subSectionId)) {
      subSectionMap.set(subSectionId, []);
    }

    subSectionMap.get(subSectionId)!.push(question);
  }

  // Convert maps to structured objects
  const templates: Template[] = [];

  templateMap.forEach((sectionMap, templateId) => {
    const sections: Section[] = [];

    sectionMap.forEach((subSectionMap, sectionId) => {
      const subSections: SubSection[] = [];

      subSectionMap.forEach((questions, subSectionId) => {
        subSections.push({
          id: subSectionId,
          questions,
        });
      });

      // Sort subsections by their first question's order
      subSections.sort((a, b) => (a.questions[0]?.order || 0) - (b.questions[0]?.order || 0));

      sections.push({
        id: sectionId,
        subSections,
      });
    });

    // Sort sections by their first subsection's first question's order
    sections.sort((a, b) => {
      const aOrder = a.subSections[0]?.questions[0]?.order || 0;
      const bOrder = b.subSections[0]?.questions[0]?.order || 0;
      return aOrder - bOrder;
    });

    templates.push({
      id: templateId,
      sections,
    });
  });

  return {
    templates,
    sectionIds: Array.from(sectionIds).sort((a, b) => a - b),
  };
};
