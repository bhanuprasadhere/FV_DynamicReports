export interface Client {
  organizationId: number;
  name: string;
}

export interface Question {
  id: number;
  text: string;
  type: string;
  required: boolean;
  order: number;
  sectionId: number;
  subSectionId: number;
  templateId: string;
  // New fields
  questionBankId?: number;
  riskLevel?: string; // Keep for backward compatibility
  riskLevels?: string[]; // NEW: Array of ALL risk levels from different templates
  templateCount?: number; // NEW: Number of templates this question appears in
  isDuplicate?: boolean;
}


export interface SubSection {
  id: number;
  questions: Question[];
}

export interface Section {
  id: number;
  subSections: SubSection[];
}

export interface Template {
  id: string;
  sections: Section[];
}

export interface GroupedSchema {
  templates: Template[];
  sectionIds: number[];
}
