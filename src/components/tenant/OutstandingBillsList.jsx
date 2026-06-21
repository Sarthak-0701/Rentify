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
    <div className="p-5 bg-slate-950/40 border border-slate-900 rounded-2xl flex flex-col shadow-xl relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-slate-900" />
      <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2 mb-4">
        <DollarSign className="w-4.5 h-4.5 text-emerald-400" /> Outstanding Bills
      </h3>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        </div>
      ) : outstandingBills.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-900 rounded-2xl bg-slate-950/10">
          <CheckCircle2 className="w-10 h-10 text-emerald-500/60 mx-auto mb-3" />
          <h4 className="text-xs font-semibold text-slate-300">All Settled!</h4>
          <p className="text-[10px] text-slate-505 mt-1">No pending rent statements found for your linked properties.</p>
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
                className="p-4 bg-black/40 border border-slate-900/80 hover:border-emerald-900/50 hover:bg-emerald-950/5 rounded-xl flex items-center justify-between cursor-pointer transition-all shadow-md group"
                title="Click to view details & pay"
              >
                <div className="flex flex-col gap-1.5">
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-400 transition-colors uppercase tracking-wide">
                      {room?.properties?.name || 'Property'}
                    </h4>
                    <p className="text-[10px] text-slate-550">Room {room?.room_number}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 border-l border-slate-900 pl-3">
                    <span className="text-[10px] text-slate-400">
                      Date: <span className="font-semibold text-slate-300">{receipt.billing_date}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Landlord: <span className="font-semibold text-slate-300">{ownerName}</span>
                    </span>
                  </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1 select-none">
                  <span className="text-[9px] font-bold text-slate-500 uppercase leading-none">Outstanding</span>
                  <span className="text-base font-black text-emerald-400 font-mono">₹{receipt.total_bill?.toLocaleString('en-IN')}</span>
                  <span className="text-[8px] text-slate-650 flex items-center gap-0.5 group-hover:text-emerald-500 transition-colors">
                    Pay Bill <ChevronRight className="w-3 h-3" />
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
