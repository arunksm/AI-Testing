import React from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import Column from './Column';
import JobCard from './JobCard';
import { useState } from 'react';

export default function KanbanBoard({ jobs, columns, onMoveJob, onEditJob, onDeleteJob }) {
  const [activeJob, setActiveJob] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const job = jobs.find((j) => j.id === active.id);
    setActiveJob(job);
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // dragging over a column
    const overColumnId = columns.find(col => col.id === overId)?.id;
    if (overColumnId) {
      const activeJob = jobs.find(j => j.id === activeId);
      if (activeJob && activeJob.status !== overColumnId) {
        onMoveJob(activeId, overColumnId);
      }
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveJob(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // If dropped on another card, find that card's column
    const overJob = jobs.find(j => j.id === overId);
    if (overJob) {
      onMoveJob(activeId, overJob.status);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="h-full overflow-x-auto overflow-y-hidden p-4">
        <div className="inline-flex gap-4 h-full min-w-full">
          {columns.map((column) => (
            <Column
              key={column.id}
              column={column}
              jobs={jobs.filter((j) => j.status === column.id)}
              onEditJob={onEditJob}
              onDeleteJob={onDeleteJob}
            />
          ))}
        </div>
      </div>

      <DragOverlay dropAnimation={{
        sideEffects: defaultDropAnimationSideEffects({
          styles: {
            active: {
              opacity: '0.5',
            },
          },
        }),
      }}>
        {activeJob ? (
          <JobCard job={activeJob} isOverlay />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
