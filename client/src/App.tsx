import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { getClients, getClientSchema } from './services/api';
import { GripVertical } from 'lucide-react';

// Draggable Sidebar Item
function DraggableItem({ id, text, type }: { id: string; text: string; type: string }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes} 
         className="p-3 bg-white border rounded shadow-sm mb-2 cursor-grab hover:bg-blue-50 flex items-center gap-2 z-50">
      <GripVertical size={16} className="text-gray-400" />
      <div className="flex-1">
        <div className="font-medium text-sm text-gray-800">{text}</div>
        <div className="text-[10px] text-gray-500 uppercase font-bold">{type}</div>
      </div>
    </div>
  );
}

// Droppable Canvas
function Canvas({ droppedItems }: { droppedItems: any[] }) {
  const { setNodeRef } = useDroppable({ id: 'canvas' });
  return (
    <div ref={setNodeRef} className="flex-1 bg-white p-8 rounded-lg shadow min-h-[600px] border-2 border-dashed border-gray-300">
      <h2 className="text-xl font-bold mb-4 text-gray-800 border-b pb-2">Report Canvas</h2>
      {droppedItems.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-gray-400">
          <p>Drag questions here to build your report</p>
        </div>
      ) : (
        <div className="space-y-3">
          {droppedItems.map((item, idx) => (
            <div key={`${item.id}-${idx}`} className="p-4 border rounded-md bg-gray-50 flex justify-between items-center group hover:border-blue-300 transition-colors">
              <span className="font-semibold text-gray-700">{item.text}</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded font-medium">{item.type}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function App() {
  const [selectedClientId, setSelectedClientId] = useState<number | null>(null);
  const [droppedItems, setDroppedItems] = useState<any[]>([]);

  // 1. Fetch Clients
  const { data: clients, isLoading: loadingClients } = useQuery({ 
    queryKey: ['clients'], 
    queryFn: getClients 
  });

  // 2. Fetch Questions (Only when client is selected)
  const { data: questions, isLoading: loadingQuestions } = useQuery({
    queryKey: ['schema', selectedClientId],
    queryFn: () => getClientSchema(selectedClientId!),
    enabled: !!selectedClientId,
  });

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (over && over.id === 'canvas') {
      // Find the dragged item data from the questions list
      const originalItem = questions?.find((q: any) => q.id.toString() === active.id);
      if (originalItem) {
        setDroppedItems([...droppedItems, originalItem]);
      }
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <div className="min-h-screen bg-gray-50 p-6 font-sans">
        {/* Top Header */}
        <header className="mb-6 bg-white p-4 rounded-lg shadow-sm flex items-center justify-between border">
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <span className="text-blue-600">Dynamic</span> Reporting
          </h1>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Select Client:</span>
            <select 
              className="border border-gray-300 p-2 rounded-md min-w-[250px] focus:ring-2 focus:ring-blue-500 outline-none"
              onChange={(e) => {
                  setSelectedClientId(Number(e.target.value));
                  setDroppedItems([]); // Clear canvas on change
              }}
            >
              <option value="">-- Choose Organization --</option>
              {loadingClients ? <option>Loading...</option> : clients?.map((c: any) => (
                <option key={c.organizationId} value={c.organizationId}>{c.name}</option>
              ))}
            </select>
          </div>
        </header>

        <div className="flex gap-6">
          {/* Left Sidebar (Sources) */}
          <aside className="w-96 flex flex-col gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border h-[calc(100vh-140px)] overflow-hidden flex flex-col">
              <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider border-b pb-2">
                Available Data Points
              </h3>
              
              <div className="overflow-y-auto flex-1 pr-2 space-y-2">
                {!selectedClientId ? (
                  <div className="text-center text-gray-400 mt-10 italic">
                    Please select a client above to load questions.
                  </div>
                ) : loadingQuestions ? (
                  <div className="text-center text-blue-500 mt-10">Loading Schema...</div>
                ) : questions?.length === 0 ? (
                  <div className="text-center text-gray-400 mt-10">No questions found.</div>
                ) : (
                  questions?.map((q: any) => (
                    <DraggableItem 
                      key={q.id} 
                      id={q.id.toString()} 
                      text={q.text || "Untitled"} 
                      type={q.dataType || "Text"} 
                    />
                  ))
                )}
              </div>
            </div>
          </aside>

          {/* Right Content (Target) */}
          <Canvas droppedItems={droppedItems} />
        </div>
      </div>
    </DndContext>
  );
}