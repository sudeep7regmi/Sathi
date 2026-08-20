import { Ground } from "@/app/types/ground";
import {
  Edit3,
  Trash2,
  MapPin,
  Sparkles,
  QrCode, 
  Layers,
  Coins,
} from "lucide-react";

interface GroundCardProps {
  ground: Ground;
  onEdit: () => void;
  onDelete: () => void;
}

export function GroundCard({ ground, onEdit, onDelete }: GroundCardProps) {
  return (
    <div
      className="p-6 rounded-3xl border shadow-2xs flex flex-col justify-between transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group relative space-y-4"
      style={{
        backgroundColor: "var(--ccolor)",
        borderColor: "var(--border-color)",
      }}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-3">
          <h3 className="font-black text-base text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight line-clamp-1">
            {ground.name}
          </h3>

          <div className="flex items-center gap-1 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
            <button
              onClick={onEdit}
              className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all cursor-pointer"
              title="Edit Arena Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
              title="Remove Arena"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2.5 text-xs font-semibold text-slate-600">
          <p className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="line-clamp-1 text-slate-700 font-bold">
              {ground.address}
            </span>
          </p>

          <div className="flex items-start gap-2 pt-1">
            <Sparkles className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <div className="flex flex-wrap gap-1">
              {ground.amenities.split(",").map((item: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-slate-100/90 border border-slate-200/60 text-slate-700 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider"
                >
                  {item.trim()}
                </span>
              ))}
            </div>
          </div>

          {ground.description && (
            <p className="text-[11px] text-slate-500 font-medium line-clamp-2 pt-1 border-t border-slate-100">
              {ground.description}
            </p>
          )}

          <div className="pt-2">
            {ground.paymentQrUrl ? (
              <div className="flex items-center gap-2.5 bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 p-2 rounded-2xl text-[10px] font-bold uppercase tracking-wider">
                <img
                  src={ground.paymentQrUrl}
                  alt="QR Code"
                  className="w-8 h-8 object-contain rounded-lg bg-white border border-emerald-100 shrink-0"
                />
                <div className="flex flex-col">
                  <span className="font-extrabold text-emerald-800">
                    Payment QR Linked
                  </span>
                  <span className="text-[9px] text-emerald-600 font-semibold lowercase">
                    Active on checkout
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 bg-amber-50/80 border border-amber-200/80 text-amber-900 p-2.5 rounded-2xl text-[10px] font-bold uppercase tracking-wider">
                <QrCode className="w-4 h-4 text-amber-600 shrink-0" />
                <span>No Payment QR Linked</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 flex items-center gap-1">
          <Layers className="w-3.5 h-3.5 text-slate-400" /> Hourly Rate
        </span>
        <p className="text-base font-black text-emerald-600 flex items-center gap-1">
          <Coins className="w-4 h-4 opacity-75" /> Rs. {ground.pricePerHour}{" "}
          <span className="text-[10px] font-bold text-slate-400 lowercase">
            / hr
          </span>
        </p>
      </div>
    </div>
  );
}