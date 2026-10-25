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
    <div className="p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl flex flex-col shadow-xl relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-app-card-border" />
      <h3 className="text-sm font-bold text-app-text-primary flex items-center gap-2 mb-4">
        <Home className="w-4.5 h-4.5 text-app-tenant-accent" /> My Active Rentals
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <Loader2 className="w-6 h-6 text-app-tenant-accent animate-spin" />
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-app-card-border rounded-xl bg-app-card-from">
          <p className="text-xs text-app-text-muted italic leading-relaxed px-4">
            No active rental listings linked. Enter a landlord tenant ID above to connect.
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-90 overflow-y-auto pr-1">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="p-4 bg-app-bg border border-app-card-border rounded-xl flex items-center justify-between shadow-xs relative overflow-hidden group transition-all"
            >
              <div className="flex flex-col gap-1.5">
                <div>
                  <h4 className="text-xs font-bold text-app-text-primary uppercase tracking-wide">
                    {room.properties?.name || 'Property'}
                  </h4>
                  <p className="text-[10px] text-app-text-muted">Room {room.room_number}</p>
                </div>
                
                <div className="space-y-0.5 border-l border-app-card-border pl-2.5">
                  <div className="text-[10px] text-app-text-secondary">
                    Landlord: <span className="font-semibold text-app-text-primary">{owners[room.properties?.owner_id] || 'Owner'}</span>
                  </div>
                  <div className="text-[10px] text-app-text-secondary">
                    Base Rent: <span className="font-semibold text-app-tenant-accent">₹{room.base_rent?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-end gap-3">
                <span className="text-[10px] bg-app-card-to text-app-text-secondary border border-app-card-border px-2 py-0.5 rounded font-mono">
                  Code: {room.tenant_code}
                </span>
                
                <button
                  id={`btn-unlink-${room.tenant_code}`}
                  onClick={() => handleUnlinkRoom(room.tenant_code)}
                  className="p-1.5 bg-app-card-to border border-app-card-border text-app-text-muted hover:text-app-danger hover:border-app-danger/50 rounded-lg cursor-pointer transition-colors"
                  title="Unlink Property"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-[9px] text-app-text-muted border-t border-app-card-border pt-3 mt-4 flex justify-between items-center">
        <span>Linked Rentals: <span className="font-semibold text-app-text-primary">{linkedCodesCount}/5</span></span>
      </div>
    </div>
  );
};

export default ActiveRentalsList;
