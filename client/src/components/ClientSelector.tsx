import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Building2, Check } from 'lucide-react';

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

export default function ClientSelector({ clients, selectedClientId, onSelect, isLoading }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedClient = clients?.find(c => c.organizationId === selectedClientId);

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

    return (
        <div className="relative z-50 w-full max-w-md" ref={containerRef}>
            <label className="block text-xs font-bold text-white uppercase tracking-wider mb-2 drop-shadow-sm ml-1">
                Select Organization
            </label>

            <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => setIsOpen(!isOpen)}
                className="w-full glass-card rounded-xl p-4 flex items-center justify-between text-left transition-all hover:bg-white/90 group"
            >
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <Building2 size={20} />
                    </div>
                    <div>
                        <p className="font-semibold text-gray-800">
                            {isLoading ? "Loading..." : selectedClient ? selectedClient.name : "Choose Client"}
                        </p>
                        {selectedClient && <p className="text-xs text-gray-500">ID: {selectedClient.organizationId}</p>}
                    </div>
                </div>
                <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                />
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl shadow-xl overflow-hidden max-h-[300px] overflow-y-auto"
                    >
                        <div className="p-2 space-y-1">
                            {clients?.map((client) => (
                                <motion.button
                                    key={client.organizationId}
                                    onClick={() => {
                                        onSelect(client.organizationId);
                                        setIsOpen(false);
                                    }}
                                    className={`w-full p-3 rounded-lg flex items-center justify-between transition-colors
                    ${selectedClientId === client.organizationId
                                            ? 'bg-blue-50 text-blue-700'
                                            : 'hover:bg-gray-50 text-gray-700'
                                        }`}
                                >
                                    <span className="font-medium text-sm truncate pr-4">{client.name}</span>
                                    {selectedClientId === client.organizationId && (
                                        <Check size={16} className="text-blue-600 flex-shrink-0" />
                                    )}
                                </motion.button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
