import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Moon, 
  Sun, 
  Download, 
  Upload,
  Briefcase
} from 'lucide-react';
import { getJobs, addJob, updateJob, deleteJob, importJobs } from './lib/db';
import KanbanBoard from './components/KanbanBoard';
import JobModal from './components/JobModal';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const COLUMNS = [
  { id: 'wishlist', title: 'Wishlist', color: 'bg-slate-500' },
  { id: 'applied', title: 'Applied', color: 'bg-blue-500' },
  { id: 'follow-up', title: 'Follow-up', color: 'bg-purple-500' },
  { id: 'interview', title: 'Interview', color: 'bg-amber-500' },
  { id: 'offer', title: 'Offer', color: 'bg-emerald-500' },
  { id: 'rejected', title: 'Rejected', color: 'bg-rose-500' },
];

export default function App() {
  const [jobs, setJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(() => 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const loadJobs = async () => {
    const data = await getJobs();
    setJobs(data);
  };

  const handleAddJob = async (jobData) => {
    if (editingJob) {
      await updateJob({ ...editingJob, ...jobData });
    } else {
      await addJob(jobData);
    }
    await loadJobs();
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleDeleteJob = async (id) => {
    if (window.confirm('Are you sure you want to delete this job application?')) {
      await deleteJob(id);
      await loadJobs();
    }
  };

  const handleMoveJob = async (jobId, newStatus) => {
    const job = jobs.find(j => j.id === jobId);
    if (job && job.status !== newStatus) {
      await updateJob({ ...job, status: newStatus });
      await loadJobs();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(jobs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const importedData = JSON.parse(event.target.result);
        if (Array.isArray(importedData)) {
          await importJobs(importedData);
          await loadJobs();
          alert('Data imported successfully!');
        }
      } catch (err) {
        alert('Failed to import JSON: Invalid format');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => 
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200">
      {/* Navbar */}
      <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
              <Briefcase className="w-5 h-5" />
            </div>
            <span className="hidden sm:inline-block">JobTracker</span>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search companies or roles..."
              className="w-full pl-10 pr-4 py-2 bg-secondary rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            
            <div className="relative group">
              <button 
                className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
                title="Backup/Restore"
              >
                <Download size={20} />
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-popover border rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button 
                  onClick={handleExport}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2"
                >
                  <Download size={14} /> Export JSON
                </button>
                <label className="w-full px-4 py-2 text-left text-sm hover:bg-secondary flex items-center gap-2 cursor-pointer">
                  <Upload size={14} /> Import JSON
                  <input type="file" accept=".json" className="hidden" onChange={handleImport} />
                </label>
              </div>
            </div>

            <button
              onClick={() => {
                setEditingJob(null);
                setIsModalOpen(true);
              }}
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Plus size={18} /> Add Job
            </button>
          </div>
        </div>
      </header>

      {/* Logic for Kanban */}
      <main className="flex-1 overflow-hidden">
        <KanbanBoard 
          jobs={filteredJobs} 
          columns={COLUMNS} 
          onMoveJob={handleMoveJob}
          onEditJob={handleEditJob}
          onDeleteJob={handleDeleteJob}
        />
      </main>

      {isModalOpen && (
        <JobModal
          job={editingJob}
          onClose={() => {
            setIsModalOpen(false);
            setEditingJob(null);
          }}
          onSave={handleAddJob}
        />
      )}
    </div>
  );
}
