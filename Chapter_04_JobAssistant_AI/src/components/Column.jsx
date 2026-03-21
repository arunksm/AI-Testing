import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import JobCard from './JobCard';
import { cn } from '../App';

export default function Column({ column, jobs, onEditJob, onDeleteJob }) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div 
      className={cn(
        "flex flex-col w-80 shrink-0 bg-secondary/50 rounded-lg p-2 transition-colors",
        isOver && "bg-secondary"
      )}
    >
      <div className="flex items-center justify-between px-2 py-3 mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", column.color)} />
          <h2 className="font-semibold text-sm tracking-tight capitalize">{column.title}</h2>
        </div>
        <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
          {jobs.length}
        </span>
      </div>

      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto kanban-column flex flex-col gap-3 min-h-[100px]"
      >
        <SortableContext items={jobs.map(j => j.id)} strategy={verticalListSortingStrategy}>
          {jobs.map((job) => (
            <JobCard 
              key={job.id} 
              job={job} 
              onEdit={() => onEditJob(job)}
              onDelete={() => onDeleteJob(job.id)}
            />
          ))}
        </SortableContext>
      </div>
    </div>
  );
}
