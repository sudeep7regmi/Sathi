import React, { FormEvent, ChangeEvent } from "react";
import { Loader2, Plus, X, UploadCloud, ImageIcon, Info } from "lucide-react";
import { GroundFormData } from "@/app/types/ground";

interface AddGroundModalProps {
  isOpen: boolean;
  submitting: boolean;
  formData: GroundFormData;
  qrFile: File | null;
  qrPreview: string | null;
  onClose: () => void;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onQrChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onClearQr: () => void;
  onSubmit: (e: FormEvent) => void;
}

const inputClass =
  "w-full bg-slate-50/70 border border-slate-200 rounded-xl p-3 text-xs font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all shadow-2xs";

export function AddGroundModal({
  isOpen,
  submitting,
  formData,
  qrFile,
  qrPreview,
  onClose,
  onChange,
  onQrChange,
  onClearQr,
  onSubmit,
}: AddGroundModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl p-6 md:p-8 space-y-5 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto"
        style={{
          backgroundColor: "var(--ccolor)",
          borderColor: "var(--border-color)",
        }}
      >
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-extrabold text-base uppercase tracking-tight text-slate-900 flex items-center gap-2">
              <span className="w-2 h-4 bg-emerald-500 rounded-full inline-block"></span>
              Register New Arena Venue
            </h3>
            <p className="text-slate-400 text-[11px] font-semibold tracking-wide uppercase mt-0.5">
              Add pitches, configure hourly rates, and attach payment QR
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
                Arena / Pitch Name <span className="text-emerald-600">*</span>
              </label>
              <input
                required
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                className={inputClass}
                placeholder="e.g., Stadium Field A (5v5)"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
                Address / Location <span className="text-emerald-600">*</span>
              </label>
              <input
                required
                type="text"
                name="address"
                value={formData.address}
                onChange={onChange}
                className={inputClass}
                placeholder="e.g., Ring Road, Kathmandu"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
                Rate Per Hour (NPR) <span className="text-emerald-600">*</span>
              </label>
              <input
                required
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={onChange}
                className={inputClass}
                placeholder="1500"
              />
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
                Amenities (Comma Separated){" "}
                <span className="text-emerald-600">*</span>
              </label>
              <input
                required
                type="text"
                name="amenities"
                value={formData.amenities}
                onChange={onChange}
                className={inputClass}
                placeholder="Parking, Night Lights, Showers, Lockers"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
              Payment QR Code (eSewa / Khalti / Bank)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/80 transition-all hover:border-slate-300">
              {qrPreview ? (
                <div className="relative w-24 h-24 rounded-xl border border-slate-200 overflow-hidden bg-white shrink-0 group shadow-2xs">
                  <img
                    src={qrPreview}
                    alt="QR Preview"
                    className="w-full h-full object-contain p-1.5"
                  />
                  <button
                    type="button"
                    onClick={onClearQr}
                    className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-90 hover:opacity-100 transition-opacity shadow-xs"
                    title="Remove Image"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <div className="w-24 h-24 rounded-xl border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-slate-400 shrink-0">
                  <ImageIcon className="w-7 h-7 mb-1 text-slate-300" />
                  <span className="text-[9px] font-extrabold uppercase tracking-wider">
                    No Image
                  </span>
                </div>
              )}

              <div className="flex-1 space-y-2 text-center sm:text-left">
                <input
                  type="file"
                  accept="image/*"
                  id="addQrInput"
                  onChange={onQrChange}
                  className="hidden"
                />
                <label
                  htmlFor="addQrInput"
                  className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-emerald-500 text-slate-700 hover:text-emerald-600 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider cursor-pointer shadow-2xs transition-all hover:shadow-xs"
                >
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  {qrFile || qrPreview
                    ? "Change Payment QR Image"
                    : "Upload QR Image"}
                </label>
                <p className="text-[10px] text-slate-400 font-semibold leading-relaxed flex items-center gap-1 justify-center sm:justify-start">
                  <Info className="w-3 h-3 text-slate-400 shrink-0" />
                  Display QR code for players to scan during booking checkout.
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider font-extrabold text-slate-500 mb-1.5">
              Pitch Specifications & Description{" "}
              <span className="text-emerald-600">*</span>
            </label>
            <textarea
              required
              name="description"
              value={formData.description}
              onChange={onChange}
              className={`${inputClass} resize-none`}
              rows={3}
              placeholder="Provide pitch dimensions, turf quality, lighting details..."
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold py-2.5 px-6 rounded-xl transition-all text-xs uppercase tracking-wider flex items-center gap-2 shadow-xs cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {submitting ? "Registering Arena..." : "Save & Register"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}