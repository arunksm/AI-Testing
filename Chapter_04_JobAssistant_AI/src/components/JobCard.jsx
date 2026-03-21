import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Building2, 
  Calendar, 
  ExternalLink, 
  MoreVertical, 
  Trash2, 
  Edit2,
  Tag,
  IndianRupee,
  DollarSign
} from 'lucide-react';
import { cn } from '../App';

export default function JobCard({ job, onEdit, onDelete, isOverlay }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: job.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const daysSinceApplied = () => {
    const diff = new Date() - new Date(job.dateApplied);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days === 0 ? 'Applied today' : `${days}d ago`;
  };

  const getStatusBorder = () => {
    switch (job.status) {
      case 'wishlist': return 'border-l-slate-400';
      case 'applied': return 'border-l-blue-400';
      case 'follow-up': return 'border-l-purple-400';
      case 'interview': return 'border-l-amber-400';
      case 'offer': return 'border-l-emerald-400';
      case 'rejected': return 'border-l-rose-400';
      default: return 'border-l-border';
    }
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="w-full h-32 bg-secondary/30 rounded-lg border-2 border-dashed border-muted-foreground/20"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group bg-card text-card-foreground p-4 rounded-xl border border-border shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4",
        getStatusBorder(),
        isOverlay && "shadow-xl border-primary ring-2 ring-primary/20",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-sm leading-tight text-foreground group-hover:text-primary transition-colors line-clamp-1">
          {job.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"
          >
            <Edit2 size={12} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
        <Building2 size={12} />
        <span className="font-medium truncate">{job.company}</span>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        {job.resumeUsed && (
          <div className="flex items-center gap-1 bg-secondary px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground">
            <Tag size={10} />
            {job.resumeUsed}
          </div>
        )}
        {job.salary && (
          <div className="flex items-center gap-1 bg-secondary px-1.5 py-0.5 rounded text-[10px] font-medium text-muted-foreground">
            {job.salary.includes('₹') ? <IndianRupee size={10} /> : <DollarSign size={10} />}
            {job.salary}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium">
          <Calendar size={10} />
          {daysSinceApplied()}
        </div>
        
        {job.url && (
          <a
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-primary hover:text-primary/80 transition-colors p-1"
            title="Open job link"
          >
            <ExternalLink size={14} />
          </a>
        )}
      </div>
    </div>
  );
}
