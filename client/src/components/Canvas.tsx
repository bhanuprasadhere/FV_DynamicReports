import React, { useMemo } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { DroppedItem, Question } from '../types';
import { Trash2, Copy, GripVertical } from 'lucide-react';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import {
  useSortable,
  CSS,
} from '@dnd-kit/sortable';

interface SortableDroppedItemProps {
  item: DroppedItem;
  onRemove: (id: string) => void;
  onDuplicate: (item: DroppedItem) => void;
}

const SortableDroppedItem: React.FC<SortableDroppedItemProps> = ({
  item,
  onRemove,
  onDuplicate,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.droppedId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all ${
        isDragging ? 'shadow-xl ring-2 ring-blue-400' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="cursor-grab active:cursor-grabbing flex-shrink-0 text-gray-400 hover:text-gray-600"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-800">{item.data.text}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
              {item.data.sectionName}
            </span>
            <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs">
              {item.data.dataType}
            </span>
          </div>
        </div>

        <div className="flex gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDuplicate(item)}
            className="p-2 hover:bg-blue-50 rounded text-blue-600 hover:text-blue-700"
            title="Duplicate"
          >
            <Copy size={16} />
          </button>
          <button
            onClick={() => onRemove(item.droppedId)}
            className="p-2 hover:bg-red-50 rounded text-red-600 hover:text-red-700"
            title="Remove"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

interface CanvasProps {
  droppedItems: DroppedItem[];
  onItemsChange: (items: DroppedItem[]) => void;
}

export const Canvas: React.FC<CanvasProps> = ({ droppedItems, onItemsChange }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas-droppable',
  });

  const sortableIds = useMemo(
    () => droppedItems.map((item) => item.droppedId),
    [droppedItems]
  );

  const handleRemove = (id: string) => {
    onItemsChange(droppedItems.filter((item) => item.droppedId !== id));
  };

  const handleDuplicate = (item: DroppedItem) => {
    const newItem: DroppedItem = {
      ...item,
      droppedId: `${item.droppedId}-copy-${Date.now()}`,
      position: droppedItems.length,
    };
    onItemsChange([...droppedItems, newItem]);
  };

  return (
    <main
      ref={setNodeRef}
      className={`flex-1 p-8 overflow-y-auto transition-colors ${
        isOver
          ? 'bg-blue-50 ring-2 ring-blue-400'
          : 'bg-gradient-to-br from-gray-50 to-gray-100'
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Report Canvas</h2>
          <p className="text-gray-600 text-sm mt-2">
            Drop questions here to build your report
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border-2 border-dashed border-gray-300 p-8 min-h-96">
          {droppedItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-gray-500 font-medium text-lg">
                Start dragging questions from the sidebar
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Build your custom report layout
              </p>
            </div>
          ) : (
            <SortableContext
              items={sortableIds}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {droppedItems.map((item) => (
                  <SortableDroppedItem
                    key={item.droppedId}
                    item={item}
                    onRemove={handleRemove}
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            </SortableContext>
          )}
        </div>

        {droppedItems.length > 0 && (
          <div className="mt-6 flex gap-4">
            <button
              onClick={() => onItemsChange([])}
              className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                const report = {
                  timestamp: new Date().toISOString(),
                  questionCount: droppedItems.length,
                  questions: droppedItems.map((item) => ({
                    id: item.data.id,
                    text: item.data.text,
                    section: item.data.sectionName,
                  })),
                };
                console.log('Report Built:', report);
                alert(`✅ Report saved with ${droppedItems.length} questions!`);
              }}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
            >
              Save Report
            </button>
          </div>
        )}
      </div>
    </main>
  );
};
