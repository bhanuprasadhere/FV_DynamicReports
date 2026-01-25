import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Building2, Check, Loader2, X, ChevronDown } from 'lucide-react';

interface Client {
    organizationId: number;
    name: string;
}

interface Props {
    clients: Client[] | undefined;
    selectedClientId: number | null;
    onSelect: (id: number) => void;
    isLoading: boolean;
}

export default function ClientSearch({ clients, selectedClientId, onSelect, isLoading }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const selectedClient = clients?.find(c => c.organizationId === selectedClientId);

    const filteredClients = clients?.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase())
    ) || [];

    // Close when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id: number) => {
        onSelect(id);
        setIsOpen(false);
        setSearch('');
    };

    return (
        <div className="relative z-50 w-full" ref={containerRef}>
            <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">
                Select Organization
            </label>

            <div className="relative group">
                {/* Main Trigger Button */}
                <div
                    onClick={() => {
                        setIsOpen(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className={`
            w-full bg-white border rounded-lg px-3 py-2.5 flex items-center gap-3 cursor-pointer transition-all duration-200 shadow-sm
            ${isOpen ? 'border-blue-500 ring-2 ring-blue-500/10' : 'border-gray-200 hover:border-gray-300'}
          `}
                >
                    <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                        <Building2 size={16} />
                    </div>

                    <div className="flex-1 min-w-0 flex items-center">
                        <span className={`block truncate text-sm font-medium ${selectedClient ? 'text-slate-800' : 'text-slate-400'}`}>
                            {selectedClient?.name || "Search clients..."}
                        </span>
                    </div>

                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </div>

                {/* Dropdown Panel */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: 8, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 8, scale: 0.98 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden max-h-[400px] flex flex-col z-[100]"
                        >
                            {/* Search Input Area */}
                            <div className="p-2 border-b border-gray-100 sticky top-0 bg-white z-10">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder="Type to filter..."
                                        className="w-full bg-slate-50 border-none rounded-lg pl-9 pr-8 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500/20 placeholder:text-gray-400"
                                    />
                                    {search && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); setSearch(''); }}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 rounded-full text-slate-400"
                                            aria-label="Clear search"
                                        >
                                            <X size={12} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* List */}
                            <div className="overflow-y-auto p-1 custom-scrollbar max-h-[300px]">
                                {isLoading ? (
                                    <div className="py-8 flex flex-col items-center gap-2 text-slate-400 justify-center">
                                        <Loader2 className="animate-spin text-blue-500" size={20} />
                                        <span className="text-xs font-medium">Loading clients...</span>
                                    </div>
                                ) : filteredClients.length > 0 ? (
                                    filteredClients.map((client) => (
                                        <button
                                            key={client.organizationId}
                                            onClick={() => handleSelect(client.organizationId)}
                                            className={`
                        w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors text-sm
                        ${selectedClientId === client.organizationId
                                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                                    : 'text-slate-700 hover:bg-slate-50'}
                      `}
                                        >
                                            <span>{client.name}</span>
                                            {selectedClientId === client.organizationId && <Check size={14} className="text-blue-600" />}
                                        </button>
                                    ))
                                ) : (
                                    <div className="py-8 text-center text-slate-400">
                                        <p className="text-xs">No clients found matching "{search}"</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-slate-50 px-3 py-2 text-[10px] text-slate-400 text-center font-medium border-t border-slate-100">
                                {filteredClients.length} results
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
