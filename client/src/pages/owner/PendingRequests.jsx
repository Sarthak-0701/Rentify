import React, { useState, useEffect } from 'react';
import { rentalService } from '../../supabase/services/rentalServices.js';
import { UserCheck, Clock, Check, X, Building, Loader2, AlertCircle } from 'lucide-react';

const PendingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await rentalService.getOwnerPendingRequests();
      setRequests(res?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    try {
      setActionLoading(true);
      if (action === 'accept') {
        await rentalService.acceptTenancyRequest(id);
        setToast('Tenant approved and linked to room!');
      } else {
        await rentalService.declineTenancyRequest(id);
        setToast('Request declined.');
      }
      setTimeout(() => setToast(null), 3000);
      await fetchRequests();
    } catch (err) {
      alert(err.message || `Failed to ${action} request.`);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-app-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-app-text-primary font-sans max-w-5xl mx-auto py-2">
      <div className="flex justify-between items-center pb-4 border-b border-app-card-border">
        <div>
          <h1 className="text-2xl font-bold text-app-accent flex items-center gap-2">
            <UserCheck className="w-6 h-6 text-app-accent" /> Pending Room Requests
          </h1>
          <p className="text-xs text-app-text-muted mt-1">
            Review incoming requests from tenants applying to link to your rooms
          </p>
        </div>
        <span className="text-xs bg-app-card-to px-3 py-1 rounded-full border border-app-card-border font-semibold">
          {requests.length} Pending
        </span>
      </div>

      {toast && (
        <div className="p-3 bg-app-tenant-accent-glow text-app-tenant-accent text-xs rounded-xl border border-app-tenant-accent-border">
          {toast}
        </div>
      )}

      {requests.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-app-card-border rounded-2xl bg-app-card-from">
          <Clock className="w-10 h-10 text-app-text-muted mx-auto mb-2 opacity-50" />
          <h3 className="text-sm font-semibold text-app-text-primary">No Pending Requests</h3>
          <p className="text-xs text-app-text-muted mt-1">
            When tenants enter a room invite code, their requests will appear here for your approval.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {requests.map((req) => (
            <div
              key={req.id}
              className="p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border hover:border-app-card-hover rounded-2xl shadow-xl flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-sm font-bold text-app-text-primary">
                      {req.profiles?.full_name || 'Anonymous Applicant'}
                    </h3>
                    <p className="text-xs text-app-accent flex items-center gap-1.5 mt-0.5">
                      <Building className="w-3.5 h-3.5" /> Room {req.rooms?.room_number} &bull; {req.properties?.name}
                    </p>
                  </div>
                  <span className="text-[10px] font-mono bg-app-card-to px-2 py-0.5 rounded border border-app-card-border text-app-text-muted">
                    {req.invite_code}
                  </span>
                </div>

                {req.current_occupant ? (
                  <div className="p-2.5 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-400 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Currently occupied by: <strong>{req.current_occupant}</strong>. Approving will replace the active occupant.</span>
                  </div>
                ) : (
                  <p className="text-[11px] text-app-tenant-accent">
                    &bull; Room is currently vacant
                  </p>
                )}
                
                <p className="text-[10px] text-app-text-muted">
                  Requested on: {new Date(req.requested_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-app-card-border">
                <button
                  onClick={() => handleAction(req.id, 'accept')}
                  disabled={actionLoading}
                  className="grow flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-app-tenant-accent hover:bg-app-tenant-accent-hover text-white rounded-xl shadow cursor-pointer disabled:opacity-50"
                >
                  <Check className="w-3.5 h-3.5" /> Accept
                </button>
                <button
                  onClick={() => handleAction(req.id, 'decline')}
                  disabled={actionLoading}
                  className="grow flex items-center justify-center gap-1.5 py-2 text-xs font-semibold bg-app-card-to hover:bg-app-danger/20 text-app-danger border border-app-card-border rounded-xl cursor-pointer disabled:opacity-50"
                >
                  <X className="w-3.5 h-3.5" /> Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PendingRequests;