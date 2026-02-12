import { BarChart3, Clock } from 'lucide-react';

export default function EMRStatsBlock() {
    return (
        <div className="bg-card border border-border rounded-lg p-8 flex flex-col items-center justify-center min-h-[400px] shadow-sm">
            <div className="p-4 bg-muted rounded-full mb-4">
                <BarChart3 className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">EMR Stats</h3>
            <p className="text-sm text-muted-foreground text-center max-w-xs mb-4">
                Prequalification EMR statistics will be available in the next version.
            </p>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Coming Soon</span>
            </div>
        </div>
    );
}
