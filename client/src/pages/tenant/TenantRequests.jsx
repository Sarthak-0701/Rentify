import React, { useState, useEffect } from 'react';
import { rentalService } from '../../supabase/services/rentalServices';
import { Send, Clock, X, Loader2, Building, AlertCircle, CheckCircle2 } from 'lucide-react';

const TenantRequests = () => {
  const [requests, setRequests] = useState([]);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancellingId, setCancellingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await rentalService.getTenantRequests();
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

  const handleSendRequest = async (e) => {
    e.preventDefault();
    if (!inviteCodeInput.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      setMessage(null);
      const res = await rentalService.requestTenancyLink(inviteCodeInput.trim());
      setMessage(res.message);
      setInviteCodeInput('');
      await fetchRequests();
    } catch (err) {
      setError(err.message || 'Failed to submit room code.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      setCancellingId(id);
      await rentalService.cancelTenantRequest(id);
      await fetchRequests();
      setMessage('Request cancelled successfully.');
    } catch (err) {
      setError(err.message || 'Failed to cancel request.');
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-app-tenant-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-app-text-primary font-sans max-w-5xl mx-auto py-2">
      <div className="flex justify-between items-center pb-4 border-b border-app-card-border">
        <div>
          <h1 className="text-2xl font-bold text-app-tenant-accent flex items-center gap-2">
            <Send className="w-6 h-6 text-app-tenant-accent" /> Room Link Requests
          </h1>
          <p className="text-xs text-app-text-muted mt-1">
            Request to link to rooms using invite codes and track approval status
          </p>
        </div>
        <span className="text-xs bg-app-card-to px-3 py-1 rounded-full border border-app-card-border font-semibold">
          {requests.length}/3 Active Requests
        </span>
      </div>

      {error && (
        <div className="p-4 bg-app-danger-glow border border-app-danger-border rounded-xl text-app-danger text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {message && (
        <div className="p-4 bg-app-tenant-accent-glow border border-app-tenant-accent-border rounded-xl text-app-tenant-accent text-xs flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
          <button onClick={() => setMessage(null)} className="cursor-pointer"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Code Submission Form */}
      <div className="p-5 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-app-text-primary">Send New Room Request</h3>
        <p className="text-xs text-app-text-muted">
          You can request up to <strong>3 different rooms</strong> concurrently. A 6-hour cooldown applies before you can re-request the same room.
        </p>

        <form onSubmit={handleSendRequest} className="flex gap-2 pt-1 max-w-md">
          <input
            type="text"
            placeholder="e.g. RENT-A58B21"
            value={inviteCodeInput}
            disabled={submitting || requests.length >= 3}
            onChange={(e) => setInviteCodeInput(e.target.value.toUpperCase())}
            className="grow bg-app-bg border border-app-card-border focus:border-app-tenant-accent rounded-xl px-4 py-2.5 text-xs text-app-text-primary placeholder-app-text-muted outline-none font-mono tracking-wider disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting || requests.length >= 3 || inviteCodeInput.length < 5}
            className="bg-app-tenant-accent hover:bg-app-tenant-accent-hover text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Submit
          </button>
        </form>
      </div>

      {/* Active Requests List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-app-text-muted">Active Submitted Requests</h3>

        {requests.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-app-card-border rounded-xl bg-app-card-from">
            <Clock className="w-8 h-8 text-app-text-muted mx-auto mb-2 opacity-40" />
            <p className="text-xs text-app-text-secondary">No active pending requests.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {requests.map((req) => (
              <div
                key={req.id}
                className="p-4 bg-linear-to-b from-app-card-from to-app-card-to border border-amber-500/30 rounded-2xl shadow-md flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-pulse" /> Pending
                    </span>
                    <span className="text-[10px] font-mono text-app-text-muted">{req.invite_code}</span>
                  </div>

                  <h4 className="text-sm font-bold text-app-text-primary">
                    Room {req.rooms?.room_number}
                  </h4>
                  <p className="text-xs text-app-text-secondary flex items-center gap-1 mt-0.5">
                    <Building className="w-3 h-3" /> {req.properties?.name}
                  </p>
                  <p className="text-[10px] text-app-text-muted mt-2">
                    Rent: ₹{Number(req.rooms?.base_rent).toLocaleString('en-IN')}/mo
                  </p>
                </div>

                <button
                  onClick={() => handleCancel(req.id)}
                  disabled={cancellingId === req.id}
                  className="w-full py-1.5 text-xs font-semibold text-app-danger bg-app-card-to hover:bg-app-danger/10 border border-app-card-border rounded-xl cursor-pointer disabled:opacity-50"
                >
                  {cancellingId === req.id ? 'Cancelling...' : 'Cancel Request'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantRequests;