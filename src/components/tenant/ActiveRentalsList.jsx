import React from 'react';
import { Home, Trash2, Loader2 } from 'lucide-react';

const ActiveRentalsList = ({
  rooms,
  owners,
  handleUnlinkRoom,
  loading,
  linkedCodesCount
}) => {
  return (
    <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900" />
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
        <Home className="w-4.5 h-4.5 text-emerald-400" /> My Active Rentals
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 text-emerald-500 animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-slate-900 rounded-xl bg-slate-950/10">
          <p className="text-xs text-slate-650 italic leading-relaxed px-4">
            No active rental listings linked. Enter a landlord tenant ID above to connect.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 bg-black/40 border border-slate-900 rounded-xl flex items-center justify-between shadow-sm relative overflow-hidden group"
            >
              <div className="flex flex-col gap-1.5">
                <div>
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                    {room.properties?.name || 'Property'}
                  </h4>
                  <p className="text-[10px] text-slate-505">Room {room.room_number}</p>
                </div>
                
                <div className="space-y-0.5 border-l border-slate-900 pl-2.5">
                  <div className="text-[10px] text-slate-400">
                    Landlord: <span className="font-semibold text-slate-300">{owners[room.properties?.owner_id] || 'Owner'}</span>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Base Rent: <span className="font-semibold text-emerald-450">₹{room.base_rent?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-[8px] bg-slate-900 text-slate-450 border border-slate-800 px-2 py-0.5 rounded font-mono">
                  Code: {room.tenant_code}
                </span>
                
                <button
                  id={`btn-unlink-${room.tenant_code}`}
                  onClick={() => handleUnlinkRoom(room.tenant_code)}
                  className="p-1.5 bg-slate-950/80 border border-slate-900 text-slate-500 hover:text-red-400 hover:border-red-950 rounded-lg cursor-pointer transition-colors"
                  title="Unlink Property"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-[9px] text-slate-505 border-t border-slate-900/50 pt-3 mt-4 flex justify-between items-center">
        <span>Linked Rentals: <span className="font-semibold text-slate-300">{linkedCodesCount}/5</span></span>
      </div>
    </div>
  );
};

export default ActiveRentalsList;
