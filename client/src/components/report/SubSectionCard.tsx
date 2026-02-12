import { QuestionField } from './QuestionField';
import type { SubSection } from '@/types/report';

interface SubSectionCardProps {
  subSection: SubSection;
}

export function SubSectionCard({ subSection }: SubSectionCardProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="h-1 w-1 rounded-full bg-primary" />
        <h4 className="text-sm font-medium text-muted-foreground">
          SubSection {subSection.id}
        </h4>
      </div>

      <div className="space-y-5 pl-3 border-l-2 border-border">
        {subSection.questions.map((question) => (
          <QuestionField key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}
