import React from 'react';
import { ChevronDown } from 'lucide-react';
import type { Client } from '../types';

interface HeaderProps {
  clients: Client[];
  selectedClientId: number | null;
  onClientChange: (clientId: number) => void;
  isLoading: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  clients,
  selectedClientId,
  onClientChange,
  isLoading,
}) => {
  return (
    <header className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg">
      <div className="px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Dynamic Reports</h1>
            <p className="text-blue-100 text-sm mt-1">Drag & Drop Report Builder</p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <label className="block text-white text-sm font-medium mb-2">
                Select Client:
              </label>
              <div className="relative">
                <select
                  value={selectedClientId || ''}
                  onChange={(e) => onClientChange(Number(e.target.value))}
                  disabled={isLoading}
                  className="appearance-none bg-white text-gray-800 px-4 py-2 pr-10 rounded-lg border-2 border-blue-300 focus:border-blue-500 focus:outline-none disabled:opacity-50 cursor-pointer font-medium"
                >
                  <option value="">
                    {isLoading ? 'Loading clients...' : 'Choose a client'}
                  </option>
                  {clients.map((client) => (
                    <option key={client.organizationId} value={client.organizationId}>
                      {client.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-10 text-gray-600 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
