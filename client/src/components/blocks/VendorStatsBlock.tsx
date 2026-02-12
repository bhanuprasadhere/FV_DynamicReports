import { useQuery } from '@tanstack/react-query';
import { GripVertical, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchVendorStats } from '@/services/api';

export default function VendorStatsBlock() {
    const { data: vendorStats = [], isLoading } = useQuery({
        queryKey: ['vendorStats'],
        queryFn: fetchVendorStats,
    });

    if (isLoading) {
        return (
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full flex flex-col">
                <Skeleton className="h-8 w-32 mb-4" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6 flex-shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">Vendor Stats</h2>
            </div>

            {/* Draggable Vendor Stats - Scrollable */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
                {vendorStats.map((stat) => (
                    <div
                        key={stat.fieldName}
                        draggable
                        onDragStart={(e) => {
                            e.dataTransfer.setData('application/json', JSON.stringify({
                                type: 'vendor-stat',
                                fieldName: stat.fieldName,
                                displayName: stat.displayName,
                            }));
                        }}
                        className="
                            flex items-center gap-3 p-3 rounded-lg border border-border
                            bg-background hover:bg-muted/50 hover:border-primary/50
                            cursor-grab active:cursor-grabbing
                            transition-all duration-200
                        "
                    >
                        <GripVertical className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">
                            {stat.displayName}
                        </span>
                    </div>
                ))}
            </div>

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800 flex-shrink-0">
                <p className="text-xs text-blue-900 dark:text-blue-100">
                    💡 <strong>Tip:</strong> Drag these fields to the Report Builder below to add them as columns
                </p>
            </div>
        </div>
    );
}

