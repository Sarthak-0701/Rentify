import React from 'react';
import { DollarSign, Loader2, CheckCircle2, ChevronRight } from 'lucide-react';

const OutstandingBillsList = ({
  rooms,
  receipts,
  owners,
  loading,
  openDetailsModal
}) => {
  // Filter and get only the most recent pending statement for each linked room
  const getOutstandingBills = () => {
    const list = [];
    rooms.forEach((room) => {
      const roomPending = receipts
        .filter((r) => r.room_id === room.id && r.status === 'Pending')
        .sort((a, b) => new Date(b.billing_date) - new Date(a.billing_date));
      
      if (roomPending.length > 0) {
        list.push(roomPending[0]);
      }
    });
    return list;
  };

  const outstandingBills = getOutstandingBills();

  return (
    <div className="p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl flex flex-col shadow-xl relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-app-card-border" />
      <h3 className="text-sm font-bold text-app-text-primary flex items-center gap-2 mb-4">
        <DollarSign className="w-4.5 h-4.5 text-app-tenant-accent" /> Outstanding Bills
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-app-tenant-accent animate-spin" />
        </div>
      ) : outstandingBills.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-app-card-border rounded-2xl bg-app-card-from">
          <CheckCircle2 className="w-10 h-10 text-app-tenant-accent/60 mx-auto mb-3" />
          <h4 className="text-xs font-semibold text-app-text-primary">All Settled!</h4>
          <p className="text-[10px] text-app-text-muted mt-1">No pending rent statements found for your linked properties.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {outstandingBills.map((receipt) => {
            const room = rooms.find((r) => r.id === receipt.room_id);
            const ownerName = owners[room?.properties?.owner_id] || 'Owner';
            
            return (
              <div
                key={receipt.id}
                onClick={() => openDetailsModal(receipt)}
                className="p-4 bg-app-bg border border-app-card-border hover:border-app-tenant-accent/50 hover:bg-app-tenant-accent-glow/10 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-xs group"
                title="Click to view details & pay"
              >
                <div className="flex flex-col gap-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-app-text-primary group-hover:text-app-tenant-accent transition-colors uppercase tracking-wide">
                      {room?.properties?.name || 'Property'}
                    </h4>
                    <p className="text-[10px] text-app-text-muted">Room {room?.room_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 border-l border-app-card-border pl-3">
                    <span className="text-[10px] text-app-text-secondary">
                      Date: <span className="font-semibold text-app-text-primary">{receipt.billing_date}</span>
                    </span>
                    <span className="text-[10px] text-app-text-secondary">
                      Landlord: <span className="font-semibold text-app-text-primary">{ownerName}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 select-none">
                  <span className="text-[9px] font-bold text-app-text-muted uppercase leading-none">Outstanding</span>
                  <span className="text-base font-black text-app-tenant-accent font-mono">₹{receipt.total_bill?.toLocaleString('en-IN')}</span>
                  <span className="text-[9px] font-bold text-app-tenant-accent flex items-center gap-0.5 transition-colors">
                    Pay Bill <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OutstandingBillsList;
