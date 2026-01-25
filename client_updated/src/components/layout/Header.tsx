import { FileBarChart } from 'lucide-react';
import type { Client } from '../../types';
import ClientDropdown from '../ui/ClientDropdown';

interface HeaderProps {
    clients: Client[] | undefined;
    selectedClientId: number | null;
    onSelectClient: (clientId: number) => void;
    isLoadingClients: boolean;
}

export default function Header({
    clients,
    selectedClientId,
    onSelectClient,
    isLoadingClients
}: HeaderProps) {
    return (
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-40">
            <div className="max-w-[1600px] mx-auto px-6 py-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Title */}
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary rounded-lg">
                            <FileBarChart className="text-white" size={24} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Dynamic Reports</h1>
                            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">
                                Enterprise Analytics Console
                            </p>
                        </div>
                    </div>

                    {/* Client Dropdown */}
                    <ClientDropdown
                        clients={clients}
                        selectedClientId={selectedClientId}
                        onSelect={onSelectClient}
                        isLoading={isLoadingClients}
                    />
                </div>
            </div>
        </header>
    );
}
