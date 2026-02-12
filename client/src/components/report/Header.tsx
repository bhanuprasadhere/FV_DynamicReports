import { FileText, Search, Moon, Sun } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { Client } from '@/types/report';

interface HeaderProps {
  clients: Client[];
  selectedClient: number | null;
  onClientChange: (clientId: number) => void;
  isLoadingClients: boolean;
}

export function Header({
  clients,
  selectedClient,
  onClientChange,
  isLoadingClients,
}: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const { theme, setTheme } = useTheme();

  // Filter clients based on search - SHOW ALL MATCHING RESULTS
  const filteredClients = useMemo(() => {
    if (!searchTerm) {
      // Show first 100 clients if no search (for performance)
      return clients.slice(0, 100);
    }

    const term = searchTerm.toLowerCase();
    // Show ALL matching results when searching
    return clients.filter(client => client.name.toLowerCase().includes(term));
  }, [clients, searchTerm]);

  const selectedClientName = clients.find(c => c.organizationId === selectedClient)?.name;

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card shadow-card">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <FileText className="h-5 w-5 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">
            Dynamic Reports
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Client:</span>

          {/* Search Input */}
          <div className="relative w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder={`Search ${clients.length.toLocaleString()} clients...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-card"
              disabled={isLoadingClients}
            />
          </div>

          {/* Selected Client Display */}
          {selectedClientName && (
            <div className="text-sm font-medium text-foreground max-w-[200px] truncate">
              {selectedClientName}
            </div>
          )}

          {/* Client Selector */}
          <Select
            value={selectedClient?.toString() || ''}
            onValueChange={(value) => onClientChange(Number(value))}
            disabled={isLoadingClients}
          >
            <SelectTrigger className="w-[200px] bg-card">
              <SelectValue placeholder={isLoadingClients ? 'Loading...' : 'Select client'} />
            </SelectTrigger>
            <SelectContent className="bg-card max-h-[400px]">
              {filteredClients.length === 0 ? (
                <div className="p-4 text-sm text-muted-foreground text-center">
                  No clients found. Try a different search.
                </div>
              ) : (
                <>
                  {filteredClients.map((client) => (
                    <SelectItem key={client.organizationId} value={client.organizationId.toString()}>
                      {client.name}
                    </SelectItem>
                  ))}
                  <div className="p-2 text-xs text-muted-foreground text-center border-t">
                    Showing {filteredClients.length} of {clients.length} clients
                  </div>
                </>
              )}
            </SelectContent>
          </Select>

          {/* Dark Mode Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="h-9 w-9"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
