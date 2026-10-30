import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../supabase/store/AuthStore.js';
import { rentalService } from '../../supabase/services/rentalServices.js';
import { Plus, Building, Loader2, Home, X } from 'lucide-react';
import { PropertyCard } from '../../components/properties/PropertyCard';
import { PropertyModal } from '../../components/properties/PropertyModal';
import { RoomModal } from '../../components/properties/RoomModal';
import { DeleteConfirmModal } from '../../components/properties/DeleteConfirmModal';

const Properties = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Modal State Controls
  const [propModal, setPropModal] = useState({ isOpen: false, mode: 'add', data: null });
  const [roomModal, setRoomModal] = useState({ isOpen: false, mode: 'add', property: null, data: null });
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, target: null });

  const fetchProperties = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await rentalService.getProperties();
      setProperties(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch properties.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  const handleCopyCode = (e, code, roomNum, propName, tenantName) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code).then(() => {
      setToast(`Copied ID: ${code} for Room ${roomNum} (${propName}) - Tenant: ${tenantName || 'Vacant'}`);
      setTimeout(() => setToast(null), 3000);
    });
  };

  // Property Handlers
  const handleSaveProperty = async (formData) => {
    try {
      setActionLoading(true);
      if (propModal.mode === 'add') {
        await rentalService.addProperty(formData);
      } else {
        await rentalService.updateProperty(propModal.data.id, formData);
      }
      setPropModal({ isOpen: false, mode: 'add', data: null });
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Property operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Room Handlers
  const handleSaveRoom = async (formData) => {
    try {
      setActionLoading(true);
      if (roomModal.mode === 'add') {
        await rentalService.addRoom({ ...formData, property_id: roomModal.property.id });
      } else {
        await rentalService.updateRoom(roomModal.data.id, formData);
      }
      setRoomModal({ isOpen: false, mode: 'add', property: null, data: null });
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Room operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Handler
  const handleConfirmDelete = async () => {
    const { target } = deleteModal;
    if (!target) return;
    try {
      setActionLoading(true);
      if (target.type === 'property') {
        await rentalService.deleteProperty(target.id);
      } else {
        await rentalService.deleteRoom(target.id);
      }
      setDeleteModal({ isOpen: false, target: null });
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Delete operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-app-text-primary font-sans relative min-h-[77vh] transition-colors">
      <div className="flex justify-between items-center pb-4 border-b border-app-card-border">
        <div>
          <h1 className="text-2xl font-bold text-app-accent tracking-tight flex items-center gap-2">
            <Home className="w-6 h-6 text-app-accent" /> Your Properties
          </h1>
          <p className="text-xs text-app-text-muted mt-1">Manage and track your properties and their respective rooms</p>
        </div>

        <button
          onClick={() => {
            if (properties.length >= 5) {
              setError('You have reached the maximum limit of 5 properties.');
              return;
            }
            setPropModal({ isOpen: true, mode: 'add', data: null });
          }}
          disabled={properties.length >= 5}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer ${
            properties.length >= 5
              ? 'bg-app-card-to text-app-text-muted border border-app-card-border cursor-not-allowed shadow-none'
              : 'bg-app-accent hover:bg-app-accent-hover text-white'
          }`}
        >
          <Plus className="w-4 h-4" /> Add Property {properties.length > 0 && `(${properties.length}/5)`}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-app-danger-glow border border-app-danger-border rounded-xl flex items-center justify-between">
          <p className="text-sm text-app-danger">{error}</p>
          <button onClick={() => setError(null)} className="text-app-danger hover:text-app-danger/80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-app-accent animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-app-card-border rounded-2xl bg-app-card-from">
          <Building className="w-12 h-12 text-app-text-muted mx-auto mb-3" />
          <p className="text-app-text-primary font-medium">No properties listed yet.</p>
          <p className="text-xs text-app-text-muted mt-1 mb-4">Create your first property to start organizing rooms.</p>
          <button
            onClick={() => setPropModal({ isOpen: true, mode: 'add', data: null })}
            className="px-4 py-2 text-xs font-semibold bg-app-card-to border border-app-card-border hover:bg-app-card-hover/20 text-app-text-primary rounded-lg cursor-pointer transition-colors"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEditProperty={(prop) => setPropModal({ isOpen: true, mode: 'edit', data: prop })}
              onDeleteProperty={(prop) => setDeleteModal({ isOpen: true, target: { type: 'property', id: prop.id, title: prop.name } })}
              onAddRoom={(prop) => setRoomModal({ isOpen: true, mode: 'add', property: prop, data: null })}
              onEditRoom={(room) => setRoomModal({ isOpen: true, mode: 'edit', property, data: room })}
              onDeleteRoom={(room) => setDeleteModal({ isOpen: true, target: { type: 'room', id: room.id, title: `Room ${room.room_number}` } })}
              onCopyCode={handleCopyCode}
              onNavigate={(propId, roomId) => navigate(`/owner-dashboard/receipts/${propId}/${roomId}`)}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <PropertyModal
        isOpen={propModal.isOpen}
        mode={propModal.mode}
        initialData={propModal.data}
        onClose={() => setPropModal({ isOpen: false, mode: 'add', data: null })}
        onSubmit={handleSaveProperty}
        loading={actionLoading}
      />

      <RoomModal
        isOpen={roomModal.isOpen}
        mode={roomModal.mode}
        property={roomModal.property}
        initialData={roomModal.data}
        onClose={() => setRoomModal({ isOpen: false, mode: 'add', property: null, data: null })}
        onSubmit={handleSaveRoom}
        loading={actionLoading}
      />

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        target={deleteModal.target}
        onClose={() => setDeleteModal({ isOpen: false, target: null })}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />

      {/* Toast Notification */}
      {toast && (
        <div
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-app-bg border border-app-accent-border rounded-xl shadow-2xl transition-all select-none"
          style={{ borderLeft: '4px solid var(--accent-color)' }}
        >
          <div className="w-2 h-2 rounded-full bg-app-accent animate-ping shrink-0" />
          <p className="text-xs text-app-text-primary font-medium leading-relaxed">{toast}</p>
        </div>
      )}
    </div>
  );
};

export default Properties;