import { BarChart3, Clock } from 'lucide-react';

export default function EMRStatsBlock() {
    return (
        <div className="card h-full flex flex-col items-center justify-center text-center min-h-[400px]">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
                <BarChart3 className="text-slate-400" size={48} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Prequalification EMR Stats</h3>
            <p className="text-slate-600 mb-4 max-w-xs">
                Electronic Medical Records statistics and prequalification data will be available in the next version.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-500">
                <Clock size={16} />
                <span>Coming Soon</span>
            </div>
        </div>
    );
}
