"use client";

import { useState, FormEvent } from "react";
import {
  SlidersHorizontal,
  Building2,
  Check,
  Edit2,
  Trash2,
  Plus,
  X,
} from "lucide-react";

export interface Ground {
  id: string;
  name: string;
  pricePerHour: number;
}

interface GroundsManagementProps {
  grounds: Ground[];
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  onAddGround: (name: string, pricePerHour: number) => Promise<void>;
  onDeleteGround: (id: string) => Promise<void>;
  onSaveEditGround: (id: string, name: string, pricePerHour: number) => Promise<void>;
}

export default function GroundsManagement({
  grounds,
  isAddModalOpen,
  setIsAddModalOpen,
  onAddGround,
  onDeleteGround,
  onSaveEditGround,
}: GroundsManagementProps) {
  const [newGround, setNewGround] = useState({ name: "", pricePerHour: "" });
  const [editingGroundId, setEditingGroundId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    pricePerHour: "",
  });

  const handleAddSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newGround.name || !newGround.pricePerHour) return;
    await onAddGround(newGround.name, Number(newGround.pricePerHour));
    setNewGround({ name: "", pricePerHour: "" });
  };

  const startEditing = (ground: Ground) => {
    setEditingGroundId(ground.id);
    setEditFormData({
      name: ground.name,
      pricePerHour: ground.pricePerHour.toString(),
    });
  };

  const handleSave = async (id: string) => {
    await onSaveEditGround(
      id,
      editFormData.name,
      Number(editFormData.pricePerHour)
    );
    setEditingGroundId(null);
  };

  return (
    <div className="space-y-6">
      {/* Add Ground Drawer Form */}
      {isAddModalOpen && (
        <div
          className="p-6 md:p-8 rounded-3xl border shadow-sm space-y-4 animate-in fade-in slide-in-from-top-4 duration-200"
          style={{
            backgroundColor: "var(--ccolor)",
            borderColor: "var(--border-color)",
          }}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-emerald-600" /> Register Pitch / Arena Ground
            </h3>
            <button
              onClick={() => setIsAddModalOpen(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Pitch Name / Designation
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ground A (5v5 Pitch)"
                value={newGround.name}
                onChange={(e) => setNewGround({ ...newGround, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Rate Per Hour (NPR)
              </label>
              <input
                type="number"
                required
                placeholder="e.g. 1200"
                value={newGround.pricePerHour}
                onChange={(e) => setNewGround({ ...newGround, pricePerHour: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            <div className="flex items-end gap-2">
              <button
                type="submit"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all shadow-xs cursor-pointer"
              >
                Save To Registry
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Grounds Registry Panel */}
      <div
        className="p-6 md:p-8 rounded-3xl border shadow-xs space-y-6"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <SlidersHorizontal className="w-5 h-5 text-emerald-600" /> Ground Management
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Modify rates, update ground designations, or delete active courts.
            </p>
          </div>
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
            {grounds.length} Registered Pitches
          </span>
        </div>

        {grounds.length === 0 ? (
          <div className="text-center py-12 border-2 border-dashed border-slate-100 rounded-2xl space-y-3">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
              No Active Pitch Registrations
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Click &quot;Add Ground&quot; above to set up hourly rental pricing and add courts to your venue profile.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {grounds.map((ground) => {
              const isEditing = editingGroundId === ground.id;

              return (
                <div
                  key={ground.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-50 border border-slate-200/80 rounded-2xl hover:border-emerald-300 transition-all gap-4 group shadow-2xs"
                >
                  {isEditing ? (
                    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        placeholder="Ground Name"
                      />
                      <input
                        type="number"
                        value={editFormData.pricePerHour}
                        onChange={(e) => setEditFormData({ ...editFormData, pricePerHour: e.target.value })}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-emerald-500"
                        placeholder="Price / Hour"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700 shadow-2xs">
                        #{ground.id.slice(-2)}
                      </div>
                      <div>
                        <h4 className="font-extrabold text-slate-800 text-sm group-hover:text-emerald-600 transition-colors uppercase tracking-tight">
                          {ground.name}
                        </h4>
                        <p className="text-[11px] font-bold text-emerald-600">
                          Rs. {ground.pricePerHour} / hour
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-200">
                    {isEditing ? (
                      <>
                        <button
                          onClick={() => handleSave(ground.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 px-3"
                        >
                          <Check className="w-3.5 h-3.5" /> Save
                        </button>
                        <button
                          onClick={() => setEditingGroundId(null)}
                          className="bg-slate-200 hover:bg-slate-300 text-slate-700 p-2 rounded-xl text-xs font-bold transition-all cursor-pointer px-3"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditing(ground)}
                          className="bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Edit Pitch"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDeleteGround(ground.id)}
                          className="bg-red-50 border border-red-200 hover:bg-red-600 hover:text-white text-red-600 p-2.5 rounded-xl transition-all cursor-pointer"
                          title="Delete Pitch"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}