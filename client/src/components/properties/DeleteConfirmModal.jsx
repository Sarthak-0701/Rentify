import { AlertTriangle, Loader2 } from 'lucide-react';

export const DeleteConfirmModal = ({ isOpen, target, onClose, onConfirm, loading }) => {
  if (!isOpen || !target) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-app-bg border border-app-danger-border rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
        <h3 className="text-lg font-bold text-app-danger mb-2 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-app-danger" />
          Confirm Delete
        </h3>

        <p className="text-sm text-app-text-secondary leading-relaxed mb-4">
          Are you sure you want to delete <span className="font-semibold text-app-text-primary">"{target.title}"</span>?{' '}
          {target.type === 'property' && 'This action will delete all nested rooms. '}
          This cannot be undone.
        </p>

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
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-danger hover:bg-app-danger-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};