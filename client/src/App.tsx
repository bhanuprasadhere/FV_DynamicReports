import React, { useState, useCallback } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useQuery } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Canvas } from './components/Canvas';
import { api } from './services/api';
import { Client, Question, DroppedItem } from './types';
import './App.css';

function App() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [droppedItems, setDroppedItems] = useState<DroppedItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      distance: 8,
    })
  );

  // Fetch all clients
  const {
    data: clients = [],
    isLoading: clientsLoading,
  } = useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => api.getClients(),
    staleTime: 1000 * 60 * 5,
  });

  // Fetch questions for selected client
  const {
    data: questions = [],
    isLoading: questionsLoading,
    error: questionsError,
  } = useQuery<Question[]>({
    queryKey: ['schema', selectedClientId],
    queryFn: () => api.getClientSchema(selectedClientId!),
    enabled: !!selectedClientId,
    staleTime: 1000 * 60 * 5,
  });

  const handleClientChange = useCallback((clientId: number) => {
    setSelectedClientId(clientId);
    setDroppedItems([]); // Clear dropped items when client changes
  }, []);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over || over.id !== 'canvas-droppable') {
      return;
    }

    const draggedData = active.data.current;
    if (!draggedData) return;

    const newItem: DroppedItem = {
      id: `dropped-${active.id}`,
      type: 'question',
      data: draggedData.question as Question,
      droppedId: `dropped-${active.id}-${Date.now()}`,
      position: droppedItems.length,
    };

    setDroppedItems((prev) => [...prev, newItem]);
  };

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-col h-screen bg-gray-100">
        <Header
          clients={clients}
          selectedClientId={selectedClientId}
          onClientChange={handleClientChange}
          isLoading={clientsLoading}
        />

        <div className="flex flex-1 overflow-hidden">
          <Sidebar
            questions={questions}
            isLoading={questionsLoading}
            error={questionsError?.message || null}
          />
          <Canvas
            droppedItems={droppedItems}
            onItemsChange={setDroppedItems}
          />
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="p-4 bg-white border-2 border-blue-400 rounded-lg shadow-xl">
            <p className="text-sm font-medium">Dragging item...</p>
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
