import { useState, useEffect } from 'react';
import { Bed, X, Loader2, UserCheck, UserX } from 'lucide-react';

export const RoomModal = ({ isOpen, mode, property, initialData, onClose, onSubmit, loading }) => {
  const [roomNumber, setRoomNumber] = useState('');
  const [isOccupied, setIsOccupied] = useState(false);
  const [tenantName, setTenantName] = useState('');
  const [baseRent, setBaseRent] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setRoomNumber(initialData.room_number || '');
      setIsOccupied(Boolean(initialData.is_occupied || initialData.tenant_name));
      setTenantName(initialData.tenant_name || '');
      setBaseRent(initialData.base_rent || '');
    } else {
      setRoomNumber('');
      setIsOccupied(false);
      setTenantName('');
      setBaseRent('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!roomNumber.trim()) return;
    if (isOccupied && !tenantName.trim()) return;

    onSubmit({
      room_number: roomNumber.trim(),
      is_occupied: isOccupied,
      tenant_name: isOccupied ? tenantName.trim() : null,
      base_rent: Number(baseRent) || 0,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-app-bg border border-app-border rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-app-text-muted hover:text-app-text-primary transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold text-app-text-primary mb-1 flex items-center gap-2">
          <Bed className="w-5 h-5 text-app-accent" />
          {mode === 'add' ? 'Add Room' : 'Edit Room Details'}
        </h3>
        <p className="text-xs text-app-text-muted mb-6">
          {mode === 'add'
            ? `Add a room inside property "${property?.name}"`
            : 'Modify the configurations of the selected room.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
              Room Number / Name
            </label>
            <input
              type="text"
              required
              disabled={loading}
              value={roomNumber}
              onChange={(e) => setRoomNumber(e.target.value)}
              placeholder="e.g. 101, Room A, Penthouse"
              className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
            />
          </div>

          {/* Occupancy Toggle */}
          <div className="p-3.5 bg-app-card-from border border-app-card-border rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              {isOccupied ? (
                <UserCheck className="w-4 h-4 text-app-tenant-accent" />
              ) : (
                <UserX className="w-4 h-4 text-app-text-muted" />
              )}
              <div>
                <span className="text-xs font-semibold text-app-text-primary block">
                  Room Occupied
                </span>
                <span className="text-[10px] text-app-text-muted">
                  {isOccupied ? 'Has an active tenant living here' : 'Currently vacant and available'}
                </span>
              </div>
            </div>

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                const nextVal = !isOccupied;
                setIsOccupied(nextVal);
                if (!nextVal) setTenantName('');
              }}
              className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                isOccupied ? 'bg-app-accent' : 'bg-app-card-to border-app-card-border'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition duration-200 ease-in-out ${
                  isOccupied ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Tenant Name field conditional on toggle */}
          {isOccupied && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-150">
              <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
                Tenant Name <span className="text-app-danger">*</span>
              </label>
              <input
                type="text"
                required={isOccupied}
                disabled={loading}
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                placeholder="e.g. Jane Watson"
                className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">
              Base Monthly Rent (₹)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-text-muted">
                <span className="text-sm">₹</span>
              </div>
              <input
                type="number"
                min="0"
                step="any"
                required
                disabled={loading}
                value={baseRent}
                onChange={(e) => setBaseRent(e.target.value)}
                placeholder="e.g. 12000"
                className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg pl-8 pr-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text-primary transition-colors border border-transparent disabled:opacity-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || (isOccupied && !tenantName.trim())}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'add' ? 'Add' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomModal;