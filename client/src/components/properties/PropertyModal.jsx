import { useState, useEffect } from 'react';
import { Building, X, Loader2 } from 'lucide-react';

export const PropertyModal = ({ isOpen, mode, initialData, onClose, onSubmit, loading }) => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (initialData && mode === 'edit') {
      setName(initialData.name || '');
      setAddress(initialData.address || '');
    } else {
      setName('');
      setAddress('');
    }
  }, [initialData, mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), address: address.trim() });
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
          <Building className="w-5 h-5 text-app-accent" />
          {mode === 'add' ? 'Add New Property' : 'Edit Property Details'}
        </h3>
        <p className="text-xs text-app-text-muted mb-6">
          {mode === 'add' ? 'Enter a name and address for your property.' : 'Change the name or address of this property.'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Property Name</label>
            <input
              type="text"
              required
              disabled={loading}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Sunshine Heights, Block B"
              className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Property Address</label>
            <input
              type="text"
              disabled={loading}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Sector- XYZ (Optional)"
              className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
            />
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
              disabled={loading}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {mode === 'add' ? 'Create' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};