import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Building2, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Client } from '../../types';
import LoadingSpinner from './LoadingSpinner';
import SearchInput from './SearchInput';

interface ClientDropdownProps {
    clients: Client[] | undefined;
    selectedClientId: number | null;
    onSelect: (clientId: number) => void;
    isLoading: boolean;
}

export default function ClientDropdown({
    clients,
    selectedClientId,
    onSelect,
    isLoading
}: ClientDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    const selectedClient = clients?.find(c => c.organizationId === selectedClientId);

    const filteredClients = clients?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (clientId: number) => {
        onSelect(clientId);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative w-full max-w-md" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-2">
                Select Client
            </label>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
          w-full bg-white border rounded-lg px-4 py-3 flex items-center justify-between
          transition-all duration-200 shadow-sm hover:shadow-md
          ${isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-slate-300'}
        `}
                disabled={isLoading}
            >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Building2 className="text-slate-400 flex-shrink-0" size={20} />
                    <span className={`text-sm font-medium truncate ${selectedClient ? 'text-slate-900' : 'text-slate-400'}`}>
                        {isLoading ? 'Loading clients...' : selectedClient?.name || 'Choose a client...'}
                    </span>
                </div>
                <ChevronDown
                    className={`text-slate-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}
                    size={20}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-lg shadow-xl z-50 max-h-96 flex flex-col overflow-hidden"
                    >
                        <div className="p-3 border-b border-slate-100">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search clients..."
                                className="w-full"
                            />
                        </div>

                        <div className="overflow-y-auto flex-1">
                            {isLoading ? (
                                <div className="py-12">
                                    <LoadingSpinner />
                                    <p className="text-center text-sm text-slate-500 mt-3">Loading clients...</p>
                                </div>
                            ) : filteredClients.length > 0 ? (
                                <div className="p-2">
                                    {filteredClients.map((client) => (
                                        <button
                                            key={client.organizationId}
                                            onClick={() => handleSelect(client.organizationId)}
                                            className={`
                        w-full px-3 py-2.5 rounded-lg flex items-center justify-between
                        text-left transition-colors text-sm
                        ${selectedClientId === client.organizationId
                                                    ? 'bg-primary/10 text-primary font-medium'
                                                    : 'text-slate-700 hover:bg-slate-50'}
                      `}
                                        >
                                            <span className="break-words pr-2">{client.name}</span>
                                            {selectedClientId === client.organizationId && (
                                                <Check className="text-primary flex-shrink-0" size={16} />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-12 text-center">
                                    <p className="text-sm text-slate-500">
                                        {search ? `No clients found matching "${search}"` : 'No clients available'}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 text-xs text-slate-500 text-center">
                            {filteredClients.length} {filteredClients.length === 1 ? 'client' : 'clients'} found
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
