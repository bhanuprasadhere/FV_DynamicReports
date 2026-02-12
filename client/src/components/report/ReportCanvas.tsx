import { TemplateSection } from './TemplateSection';
import { EmptyState } from './EmptyState';
import { LoadingSkeleton } from './LoadingSkeleton';
import type { GroupedSchema } from '@/types/report';

interface ReportCanvasProps {
  schema: GroupedSchema | null;
  isLoading: boolean;
  hasSelectedClient: boolean;
}

export function ReportCanvas({ schema, isLoading, hasSelectedClient }: ReportCanvasProps) {
  if (!hasSelectedClient) {
    return <EmptyState />;
  }

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!schema || schema.templates.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-foreground">
            No Questions Found
          </h2>
          <p className="text-muted-foreground">
            This client doesn't have any report questions configured yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {schema.templates.map((template) => (
        <TemplateSection key={template.id} template={template} />
      ))}
    </div>
  );
}
