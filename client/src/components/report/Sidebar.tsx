import { cn } from '@/lib/utils';
import { LayoutGrid } from 'lucide-react';

interface SidebarProps {
  sectionIds: number[];
  activeSection: number | null;
  onSectionClick: (sectionId: number) => void;
}

export function Sidebar({ sectionIds, activeSection, onSectionClick }: SidebarProps) {
  return (
    <aside className="sticky top-16 h-[calc(100vh-4rem)] w-64 flex-shrink-0 border-r border-border bg-sidebar overflow-y-auto scrollbar-thin">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Sections
          </h2>
        </div>

        <nav className="space-y-1">
          {sectionIds.map((sectionId) => (
            <button
              key={sectionId}
              onClick={() => onSectionClick(sectionId)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-sm font-medium transition-all duration-150',
                activeSection === sectionId
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              )}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-muted text-xs font-semibold text-muted-foreground">
                {sectionId}
              </span>
              <span>Section {sectionId}</span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
