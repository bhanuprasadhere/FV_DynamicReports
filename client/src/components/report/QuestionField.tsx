import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import type { Question } from '@/types/report';

interface QuestionFieldProps {
  question: Question;
}

export function QuestionField({ question }: QuestionFieldProps) {
  const isLongText = question.text.length > 100;

  return (
    <div className="space-y-2">
      <div className="flex items-start justify-between gap-4">
        <Label className="text-sm font-medium text-foreground leading-relaxed">
          {question.text}
          {question.required && (
            <span className="ml-1 text-destructive">*</span>
          )}
        </Label>
        <span className="flex-shrink-0 text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
          ID: {question.id}
        </span>
      </div>

      {isLongText ? (
        <Textarea
          placeholder="Enter your response..."
          className="min-h-[100px] bg-card resize-y"
        />
      ) : (
        <Input
          type="text"
          placeholder="Enter your response..."
          className="bg-card"
        />
      )}
    </div>
  );
}
