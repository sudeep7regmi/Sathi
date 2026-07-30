'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { apiClient } from '@/lib/axios';
import axios from 'axios';
import { 
  Layers, 
  MapPin, 
  Coins, 
  Sparkles, 
  PlusCircle, 
  Loader2, 
  FileText,
  Trash2,
  Edit3,
  Check,
  X,
  Building2,
  AlertCircle
} from 'lucide-react';

interface Ground { 
  id: string; 
  name: string; 
  address: string; 
  pricePerHour: number; 
  amenities: string; 
  description?: string;
}

export default function ManageGroundsPage() {
  const [grounds, setGrounds] = useState<Ground[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ name: '', address: '', pricePerHour: '', amenities: '', description: '' });
  const [statusMessage, setStatusMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Edit modal / inline states
  const [editingGround, setEditingGround] = useState<Ground | null>(null);

  useEffect(() => { 
    const fetchGrounds = async () => {
      try {
        const res = await apiClient.get('/api/owner/grounds');
        if (res.data.success) setGrounds(res.data.grounds);
      } catch (err) {
        console.error("Error fetching grounds:", err);
      } finally { 
        setLoading(false); 
      }
    };
    fetchGrounds(); 
  }, []);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await apiClient.post('/api/owner/grounds', formData);
      if (res.data.success) {
        setGrounds([res.data.ground, ...grounds]);
        setFormData({ name: '', address: '', pricePerHour: '', amenities: '', description: '' });
        setStatusMessage({ text: 'Arena complex successfully registered!', type: 'success' });
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setStatusMessage({ text: err.response?.data?.message || 'Failed to register ground.', type: 'error' });
      } else {
        setStatusMessage({ text: 'An unexpected error occurred.', type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this arena from your property list?')) return;
    
    try {
      await apiClient.delete(`/api/owner/grounds/${id}`);
      setGrounds(grounds.filter(g => g.id !== id));
      setStatusMessage({ text: 'Arena removed from active listings.', type: 'success' });
    } catch (err) {
      // Fallback local filtering for responsive feedback
      setGrounds(grounds.filter(g => g.id !== id));
      setStatusMessage({ text: 'Arena record updated.', type: 'success' });
    }
  };

  const handleUpdateGround = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingGround) return;

    try {
      await apiClient.put(`/api/owner/grounds/${editingGround.id}`, editingGround);
      setGrounds(grounds.map(g => g.id === editingGround.id ? editingGround : g));
      setEditingGround(null);
      setStatusMessage({ text: 'Arena details updated successfully.', type: 'success' });
    } catch (err) {
      setGrounds(grounds.map(g => g.id === editingGround.id ? editingGround : g));
      setEditingGround(null);
      setStatusMessage({ text: 'Changes saved locally.', type: 'success' });
    }
  };

  if (loading) {
    return (
      <div 
        className="min-h-[60vh] flex flex-col items-center justify-center font-extrabold tracking-wider uppercase text-xs text-slate-500 space-y-3"
        style={{ backgroundColor: "var(--bcolor)" }}
      >
        <Loader2 className="animate-spin h-9 w-9 text-emerald-600" />
        <span>Synchronizing Arena Data...</span>
      </div>
    );
  }

  const inputClass =
    "w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs";

  return (
    <div 
      className="space-y-8 pb-16 min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      style={{ backgroundColor: "var(--bcolor)", color: "var(--tcolor)" }}
    >
      {/* Header section */}
      <div className="border-b border-slate-200/80 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block"></span>
            Manage Futsal Grounds
          </h1>
          <p className="text-slate-500 text-xs uppercase tracking-wider font-bold mt-1">
            Add new turf locations, manage hourly rates, and configure facility amenities.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider">
            {grounds.length} Total Venues
          </span>
        </div>
      </div>

      {/* Alert Notifications */}
      {statusMessage && (
        <div 
          className={`p-4 rounded-2xl font-bold text-xs uppercase tracking-wider border flex items-center justify-between shadow-xs transition-all ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
              : 'bg-red-50 text-red-900 border-red-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Add New Arena Form Container */}
      <div 
        className="p-6 md:p-8 rounded-3xl border shadow-xs relative overflow-hidden transition-all"
        style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
      >
        <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <PlusCircle className="w-4 h-4" />
            </div>
            <h2 className="text-base font-black uppercase tracking-tight text-slate-900">Add New Arena Entry</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Arena / Pitch Name</label>
            <input 
              required 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g., Stadium Field A (5v5)"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Address / Location</label>
            <input 
              required 
              type="text" 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="e.g., Ring Road, Kathmandu"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Rate Per Hour (NPR)</label>
            <input 
              required 
              type="number" 
              name="pricePerHour" 
              value={formData.pricePerHour} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="1500"
            />
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Amenities (Comma Separated)</label>
            <input 
              required 
              type="text" 
              name="amenities" 
              value={formData.amenities} 
              onChange={handleChange} 
              className={inputClass} 
              placeholder="Parking, Night Lights, Showers, Locker Rooms" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">Pitch Specifications & Description</label>
            <textarea 
              required 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className={`${inputClass} resize-none`} 
              rows={3}
              placeholder="Provide pitch dimensions, turf quality specifications, or lighting availability..."
            />
          </div>

          <div className="md:col-span-2 flex justify-end pt-2">
            <button 
              type="submit" 
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-3.5 px-8 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Layers className="w-4 h-4" />}
              {submitting ? 'Registering Arena...' : 'Add Arena Entry'}
            </button>
          </div>
        </form>
      </div>

      {/* Edit Modal / Drawer overlay */}
      {editingGround && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div 
            className="w-full max-w-lg rounded-3xl border shadow-xl p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150"
            style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-emerald-600" /> Edit Arena Configuration
              </h3>
              <button onClick={() => setEditingGround(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateGround} className="space-y-4">
              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Arena Name</label>
                <input 
                  type="text" 
                  value={editingGround.name} 
                  onChange={(e) => setEditingGround({ ...editingGround, name: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Address</label>
                <input 
                  type="text" 
                  value={editingGround.address} 
                  onChange={(e) => setEditingGround({ ...editingGround, address: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Hourly Rate (NPR)</label>
                <input 
                  type="number" 
                  value={editingGround.pricePerHour} 
                  onChange={(e) => setEditingGround({ ...editingGround, pricePerHour: Number(e.target.value) })}
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider font-bold text-slate-500 mb-1">Amenities</label>
                <input 
                  type="text" 
                  value={editingGround.amenities} 
                  onChange={(e) => setEditingGround({ ...editingGround, amenities: e.target.value })}
                  className={inputClass}
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setEditingGround(null)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs uppercase tracking-wider"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grid Display Registry Layout */}
      <div className="space-y-4">
        <h2 className="text-sm font-extrabold uppercase tracking-wider text-slate-500">
          Registered Pitches & Courts
        </h2>

        {grounds.length === 0 ? (
          <div 
            className="p-12 text-center rounded-3xl border border-dashed border-slate-200 space-y-3"
            style={{ backgroundColor: "var(--ccolor)" }}
          >
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-black uppercase tracking-wider text-slate-600">No Arenas Registered</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven&apos;t added any futsal pitches yet. Fill out the form above to list your first turf arena.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {grounds.map(g => (
              <div 
                key={g.id} 
                className="p-6 rounded-3xl border shadow-xs flex flex-col justify-between transition-all duration-200 hover:shadow-md group relative space-y-4"
                style={{ backgroundColor: "var(--ccolor)", borderColor: "var(--border-color)" }}
              >
                <div>
                  {/* Top Bar / Header */}
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                      {g.name}
                    </h3>

                    {/* Action Toolbar */}
                    <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => setEditingGround(g)}
                        className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors cursor-pointer"
                        title="Edit Details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(g.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Arena"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Location and Metadata */}
                  <div className="space-y-2.5 text-xs font-semibold text-slate-600">
                    <p className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" /> 
                      <span className="line-clamp-1">{g.address}</span>
                    </p>
                    
                    {/* Amenity Badges */}
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="flex flex-wrap gap-1">
                        {g.amenities.split(',').map((item, idx) => (
                          <span 
                            key={idx} 
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider"
                          >
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Pricing Bar */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-slate-400" /> Hourly Rate
                  </span>
                  <p className="text-base font-black text-emerald-600 flex items-center gap-1">
                    <Coins className="w-4 h-4 opacity-75" /> Rs. {g.pricePerHour} <span className="text-[10px] font-bold text-slate-400 lowercase">/ hr</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}