import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../App';

const STATUS_OPTIONS = [
  { id: 'wishlist', label: 'Wishlist' },
  { id: 'applied', label: 'Applied' },
  { id: 'follow-up', label: 'Follow-up' },
  { id: 'interview', label: 'Interview' },
  { id: 'offer', label: 'Offer' },
  { id: 'rejected', label: 'Rejected' },
];

export default function JobModal({ job, onClose, onSave }) {
  const [formData, setFormData] = useState({
    company: '',
    title: '',
    url: '',
    resumeUsed: '',
    salary: '',
    notes: '',
    status: 'wishlist',
    dateApplied: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.company || !formData.title) return;
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl border border-border overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">{job ? 'Edit Job Application' : 'Add New Job'}</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded-full text-muted-foreground transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium">Company Name *</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Google, Meta, etc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 col-span-2 sm:col-span-1">
              <label className="text-sm font-medium">Job Title / Role *</label>
              <input
                required
                type="text"
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                placeholder="Software Engineer"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">LinkedIn Job URL</label>
            <input
              type="url"
              className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="https://linkedin.com/jobs/view/..."
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Resume Used</label>
              <input
                type="text"
                list="resumes"
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. SDE_Resume_v1"
                value={formData.resumeUsed}
                onChange={(e) => setFormData({ ...formData, resumeUsed: e.target.value })}
              />
              <datalist id="resumes">
                <option value="SDE_Resume" />
                <option value="QA_Resume" />
                <option value="Lead_Resume" />
              </datalist>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Salary Range</label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="e.g. ₹25-30 LPA"
                value={formData.salary}
                onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Status</label>
              <select
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all appearance-none"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                {STATUS_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium">Date Applied</label>
              <input
                type="date"
                className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.dateApplied}
                onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Notes</label>
            <textarea
              className="w-full px-3 py-2 bg-secondary/50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all min-h-[100px] resize-none"
              placeholder="Recruiter name, referral info, next steps..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border rounded-lg font-medium hover:bg-secondary transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              {job ? 'Update Job' : 'Add Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
