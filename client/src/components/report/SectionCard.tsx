import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SubSectionCard } from './SubSectionCard';
import { Layers } from 'lucide-react';
import type { Section } from '@/types/report';

interface SectionCardProps {
  section: Section;
}

export function SectionCard({ section }: SectionCardProps) {
  return (
    <Card 
      id={`section-${section.id}`}
      className="shadow-card hover:shadow-card-hover transition-shadow duration-200 bg-card"
    >
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Layers className="h-4 w-4 text-primary" />
          </div>
          Section {section.id}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {section.subSections.map((subSection) => (
          <SubSectionCard key={subSection.id} subSection={subSection} />
        ))}
      </CardContent>
    </Card>
  );
}
