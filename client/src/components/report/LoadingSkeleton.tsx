import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="shadow-card bg-card">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-lg" />
              <Skeleton className="h-6 w-32" />
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {[1, 2].map((j) => (
              <div key={j} className="space-y-4">
                <Skeleton className="h-4 w-24" />
                <div className="space-y-4 pl-3">
                  {[1, 2, 3].map((k) => (
                    <div key={k} className="space-y-2">
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-10 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
