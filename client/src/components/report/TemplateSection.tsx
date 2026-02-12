import { SectionCard } from './SectionCard';
import { FileStack } from 'lucide-react';
import type { Template } from '@/types/report';

interface TemplateSectionProps {
  template: Template;
}

export function TemplateSection({ template }: TemplateSectionProps) {
  // Truncate template ID for display
  const displayId = template.id.length > 8 
    ? `${template.id.substring(0, 8)}...` 
    : template.id;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 pb-2 border-b border-border">
        <FileStack className="h-5 w-5 text-primary" />
        <h3 className="text-base font-semibold text-foreground">
          Template: {displayId}
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          ({template.sections.length} sections)
        </span>
      </div>

      <div className="space-y-6">
        {template.sections.map((section) => (
          <SectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  );
}
