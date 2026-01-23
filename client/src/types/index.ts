// Domain Models
export interface Client {
  organizationId: number;
  name: string;
}

export interface Question {
  id: number;
  text: string;
  dataType: string;
  sectionName: string;
  category: string;
  riskLevel?: string;
  safetyLevel?: string;
  isMandatory: boolean;
  description?: string;
  questionBankId?: number;
}

export interface SchemaResponse {
  questions: Question[];
}

// UI State
export interface DragItem {
  id: string;
  type: 'question';
  data: Question;
}

export interface DroppedItem extends DragItem {
  droppedId: string;
  position: number;
}

// Filters
export interface QuestionFilters {
  searchText: string;
  riskLevel: string | null;
  safetyLevel: string | null;
  section: string | null;
  isMandatoryOnly: boolean;
}
