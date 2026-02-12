import { Building2 } from 'lucide-react';

export function EmptyState() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="mb-2 text-xl font-semibold text-foreground">
          No Client Selected
        </h2>
        <p className="text-muted-foreground">
          Please select a client from the dropdown above to view their report questions and begin filling out the form.
        </p>
      </div>
    </div>
  );
}
