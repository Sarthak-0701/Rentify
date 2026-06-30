import React from 'react';
import { Plus, Loader2, ArrowRight, Info } from 'lucide-react';

const LinkRentalRoom = ({
  tenantCodeInput,
  setTenantCodeInput,
  handleLinkRoom,
  linkLoading,
  linkedCodesCount
}) => {
  return (
    <div className="p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl flex flex-col shadow-xl relative overflow-hidden transition-colors">
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-app-card-border" />
      <h3 className="text-sm font-bold text-app-text-primary flex items-center gap-2 mb-2">
        <Plus className="w-4.5 h-4.5 text-app-tenant-accent" /> Link Rental Room
      </h3>
      <p className="text-xs text-app-text-muted mb-4 leading-relaxed">
        Link up to <span className="text-app-tenant-accent font-bold">5 active rental properties</span> using the 6-digit code provided by your landlord.
      </p>

      <form onSubmit={handleLinkRoom} className="flex gap-2">
        <input
          id="input-tenant-id"
          type="text"
          maxLength="6"
          placeholder="Enter Code (e.g. 388939)"
          value={tenantCodeInput}
          onChange={(e) => setTenantCodeInput(e.target.value.replace(/[^0-9]/g, ''))}
          disabled={linkLoading || linkedCodesCount >= 5}
          className="grow bg-app-bg border border-app-card-border focus:border-app-tenant-accent rounded-xl px-4 py-2 text-xs text-app-text-primary placeholder-app-text-muted outline-none transition-colors text-center font-mono tracking-widest disabled:opacity-40"
        />
        <button
          id="btn-link-room"
          type="submit"
          disabled={linkLoading || linkedCodesCount >= 5 || tenantCodeInput.length !== 6}
          className="bg-app-tenant-accent hover:bg-app-tenant-accent-hover disabled:bg-app-tenant-accent-glow disabled:text-app-text-muted text-white px-4 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-md flex items-center justify-center gap-1 shrink-0"
        >
          {linkLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <ArrowRight className="w-3.5 h-3.5" />
          )}
          Link
        </button>
      </form>

      {linkedCodesCount >= 5 && (
        <div className="mt-3 p-3 bg-amber-950/20 border border-amber-900/30 rounded-xl flex items-start gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
          <span className="text-[9px] text-amber-400 leading-relaxed">
            Maximum limit of 5 linked rooms reached. Unlink a property below to link a new one.
          </span>
        </div>
      )}
    </div>
  );
};

export default LinkRentalRoom;
