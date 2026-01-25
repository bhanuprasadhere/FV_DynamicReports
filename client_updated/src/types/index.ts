export interface Client {
    organizationId: number;
    name: string;
}

export interface Question {
    id: number;
    text: string;
    questionBankId: number | null;
    riskLevel: string | null;
    isDuplicate: boolean;
}

export type RiskLevel = 'Safety' | 'Low Risk' | 'Medium Risk' | 'High Risk' | null;

export type SelectionMode = 'drag' | 'checkbox';

export interface SelectedQuestion extends Question {
    selectedAt: Date;
}

export interface StatsData {
    totalQuestions: number;
    criticalRisks: number;
    duplicates: number;
}
