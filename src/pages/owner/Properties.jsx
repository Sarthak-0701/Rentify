import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../supabase/store/AuthStore';
import { rentalService } from '../../supabase/services/rentalServices';
import { supabase } from '../../supabase/client';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Building, 
  Bed, 
  User, 
  DollarSign, 
  X, 
  Loader2, 
  Home, 
  AlertTriangle 
} from 'lucide-react';

const Properties = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modal controls
  const [activeModal, setActiveModal] = useState(null); // 'addProp' | 'editProp' | 'addRoom' | 'editRoom'
  const [deleteConfirm, setDeleteConfirm] = useState(null); // { type: 'property' | 'room', id: string, title: string }

  // Selection states
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form states
  const [propertyName, setPropertyName] = useState('');
  const [roomData, setRoomData] = useState({
    roomNumber: '',
    tenantName: '',
    baseRent: ''
  });

  // Fetch properties
  const fetchProperties = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setError(null);
      const data = await rentalService.getProperties(user.id);
      setProperties(data || []);
    } catch (err) {
      console.error('Error fetching properties:', err.message);
      setError(err.message || 'Failed to fetch properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [user]);

  // Property CRUD actions
  const handleAddProperty = async (e) => {
    e.preventDefault();
    if (!propertyName.trim()) return;
    try {
      setActionLoading(true);
      await rentalService.addProperty(propertyName.trim());
      setPropertyName('');
      setActiveModal(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to add property.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();
    if (!propertyName.trim() || !selectedProperty) return;
    try {
      setActionLoading(true);
      await rentalService.updateProperty(selectedProperty.id, propertyName.trim());
      setPropertyName('');
      setSelectedProperty(null);
      setActiveModal(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to update property.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProperty = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'property') return;
    try {
      setActionLoading(true);
      await rentalService.deleteProperty(deleteConfirm.id);
      setDeleteConfirm(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to delete property.');
    } finally {
      setActionLoading(false);
    }
  };

  // Room CRUD actions
  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomData.roomNumber.trim() || !selectedProperty) return;
    try {
      setActionLoading(true);
      await rentalService.addRoom(
        selectedProperty.id,
        roomData.roomNumber.trim(),
        roomData.tenantName.trim(),
        roomData.baseRent
      );
      setRoomData({ roomNumber: '', tenantName: '', baseRent: '' });
      setSelectedProperty(null);
      setActiveModal(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to add room.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditRoom = async (e) => {
    e.preventDefault();
    if (!roomData.roomNumber.trim() || !selectedRoom) return;
    try {
      setActionLoading(true);
      await rentalService.updateRoom(
        selectedRoom.id,
        roomData.roomNumber.trim(),
        roomData.tenantName.trim(),
        roomData.baseRent
      );
      setRoomData({ roomNumber: '', tenantName: '', baseRent: '' });
      setSelectedRoom(null);
      setActiveModal(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to update room.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteRoom = async () => {
    if (!deleteConfirm || deleteConfirm.type !== 'room') return;
    try {
      setActionLoading(true);
      await rentalService.deleteRoom(deleteConfirm.id);
      setDeleteConfirm(null);
      await fetchProperties();
    } catch (err) {
      setError(err.message || 'Failed to delete room.');
    } finally {
      setActionLoading(false);
    }
  };

  // Modal open helper to set initial state
  const openModal = (type, data = null) => {
    setActiveModal(type);
    if (type === 'addProp') {
      setPropertyName('');
    } else if (type === 'editProp' && data) {
      setSelectedProperty(data);
      setPropertyName(data.name);
    } else if (type === 'addRoom' && data) {
      setSelectedProperty(data);
      setRoomData({ roomNumber: '', tenantName: '', baseRent: '' });
    } else if (type === 'editRoom' && data) {
      setSelectedRoom(data);
      setRoomData({
        roomNumber: data.room_number,
        tenantName: data.tenant_name || '',
        baseRent: data.base_rent || ''
      });
    }
  };

  return (
    <div className="space-y-6 text-app-text-primary font-sans relative min-h-[77vh] transition-colors">
      {/* Header Row */}
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
              setError("You have reached the maximum limit of 5 properties.");
              return;
            }
            openModal('addProp');
          }}
          disabled={properties.length >= 5}
          className={`flex items-center gap-1.5 px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-lg transition-all shadow-md cursor-pointer ${
            properties.length >= 5
              ? 'bg-app-card-to text-app-text-muted border border-app-card-border cursor-not-allowed shadow-none'
              : 'bg-app-accent hover:bg-app-accent-hover text-white'
          }`}
          title={properties.length >= 5 ? "Maximum limit of 5 properties reached" : "Add Property"}
        >
          <Plus className="w-4 h-4" /> Add Property {properties.length > 0 && `(${properties.length}/5)`}
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 bg-app-danger-glow border border-app-danger-border rounded-xl flex items-center justify-between">
          <p className="text-sm text-app-danger">{error}</p>
          <button onClick={() => setError(null)} className="text-app-danger hover:text-app-danger/80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main Grid View */}
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
            onClick={() => openModal('addProp')}
            className="px-4 py-2 text-xs font-semibold bg-app-card-to border border-app-card-border hover:bg-app-card-hover/20 text-app-text-primary rounded-lg cursor-pointer transition-colors"
          >
            Add Property
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {properties.map((property) => (
            <div 
              key={property.id} 
              className="p-6 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl shadow-xl flex flex-col justify-between group hover:border-app-card-hover transition-colors relative overflow-hidden"
            >
              {/* Card Header */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-app-text-primary font-sans flex items-center gap-2">
                    <Building className="w-5 h-5 text-app-accent/80" />
                    {property.name}
                  </h3>
                  
                  {/* Property Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openModal('editProp', property)}
                      title="Edit Property"
                      className="p-1.5 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-accent rounded-lg transition-colors cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ type: 'property', id: property.id, title: property.name })}
                      title="Delete Property"
                      className="p-1.5 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-danger rounded-lg transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Rooms Checklist */}
                <div className="space-y-2 border-l-2 border-app-card-border pl-4">
                  {property.rooms && property.rooms.length > 0 ? (
                    property.rooms.map((room) => (
                      <div 
                        key={room.id}
                        onClick={() => navigate(`/owner-dashboard/receipts/${property.id}/${room.id}`)}
                        className="group/room flex justify-between items-center p-3 bg-app-card-from border border-app-card-border rounded-xl hover:border-app-card-hover hover:bg-app-card-hover/10 transition-colors cursor-pointer"
                      >
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-app-text-primary flex items-center gap-1.5">
                            <Bed className="w-3.5 h-3.5 text-app-accent/60" /> Room {room.room_number}
                          </span>
                          {room.tenant_name && (
                            <div className="flex items-center gap-2 mt-0.5 pl-5">
                              <span className="text-[11px] text-app-text-muted flex items-center gap-1">
                                <User className="w-2.5 h-2.5" /> {room.tenant_name}
                              </span>
                              {room.tenant_code && (
                                <span className="text-[9px] bg-app-card-to text-app-text-secondary px-1.5 py-0.5 rounded font-mono border border-app-card-border">
                                  ID: {room.tenant_code}
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-[11px] font-semibold bg-app-accent-glow text-app-accent px-2.5 py-1 rounded-full border border-app-accent-border flex items-center">
                            ₹{Number(room.base_rent).toLocaleString('en-IN')}
                          </span>

                          {/* Room Actions */}
                          <div className="flex items-center opacity-0 group-hover/room:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  openModal('editRoom', room);
                              }}
                              title="Edit Room"
                              className="p-1 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-accent rounded-md cursor-pointer transition-colors"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteConfirm({ type: 'room', id: room.id, title: `Room ${room.room_number}` });
                              }}
                              title="Delete Room"
                              className="p-1 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-danger rounded-md cursor-pointer transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-app-text-muted italic py-2 pl-2">No rooms added to this property.</p>
                  )}
                </div>
              </div>

              {/* Add Room Button in Property Card */}
              <div className="mt-4 pt-4 border-t border-app-card-border flex justify-end">
                {property.rooms && property.rooms.length >= 12 ? (
                  <span className="text-[11px] font-bold text-app-text-muted uppercase tracking-wider">
                    Max 12 Rooms Reached
                  </span>
                ) : (
                  <button
                    onClick={() => openModal('addRoom', property)}
                    className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-app-text-secondary hover:text-app-accent transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Room
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= MODAL TEMPLATES ================= */}
      
      {/* 1. Add/Edit Property Modal */}
      {(activeModal === 'addProp' || activeModal === 'editProp') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-app-bg border border-app-border rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-app-text-muted hover:text-app-text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-app-text-primary mb-1 flex items-center gap-2">
              <Building className="w-5 h-5 text-app-accent" />
              {activeModal === 'addProp' ? 'Add New Property' : 'Rename Property'}
            </h3>
            <p className="text-xs text-app-text-muted mb-6">
              {activeModal === 'addProp' ? 'Enter a name for your property portfolio.' : 'Change the name of this property.'}
            </p>

            <form onSubmit={activeModal === 'addProp' ? handleAddProperty : handleEditProperty} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Property Name</label>
                <input
                  type="text"
                  required
                  disabled={actionLoading}
                  value={propertyName}
                  onChange={(e) => setPropertyName(e.target.value)}
                  placeholder="e.g. Sunshine Heights, Block B"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text-primary transition-colors border border-transparent disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {activeModal === 'addProp' ? 'Create' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Add/Edit Room Modal */}
      {(activeModal === 'addRoom' || activeModal === 'editRoom') && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-app-bg border border-app-border rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
            <button
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 text-app-text-muted hover:text-app-text-primary transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-bold text-app-text-primary mb-1 flex items-center gap-2">
              <Bed className="w-5 h-5 text-app-accent" />
              {activeModal === 'addRoom' ? 'Add Room' : 'Edit Room Details'}
            </h3>
            <p className="text-xs text-app-text-muted mb-6">
              {activeModal === 'addRoom' 
                ? `Add a room inside property "${selectedProperty?.name}"` 
                : 'Modify the configurations of the selected room.'
              }
            </p>

            <form onSubmit={activeModal === 'addRoom' ? handleAddRoom : handleEditRoom} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Room Number / Name</label>
                <input
                  type="text"
                  required
                  disabled={actionLoading}
                  value={roomData.roomNumber}
                  onChange={(e) => setRoomData({ ...roomData, roomNumber: e.target.value })}
                  placeholder="e.g. 101, Room A, Penthouse"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Tenant Name (Optional)</label>
                <input
                  type="text"
                  disabled={actionLoading}
                  value={roomData.tenantName}
                  onChange={(e) => setRoomData({ ...roomData, tenantName: e.target.value })}
                  placeholder="e.g. Jane Watson (Leave blank if unoccupied)"
                  className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg px-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-app-text-secondary mb-2">Base Monthly Rent (₹)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-app-text-muted">
                    <span className="text-sm">₹</span>
                  </div>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    required
                    disabled={actionLoading}
                    value={roomData.baseRent}
                    onChange={(e) => setRoomData({ ...roomData, baseRent: e.target.value })}
                    placeholder="e.g. 12000"
                    className="w-full bg-app-card-from border border-app-card-border focus:border-app-accent rounded-lg pl-8 pr-4 py-2.5 text-sm text-app-text-primary placeholder-app-text-muted outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text-primary transition-colors border border-transparent disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-accent hover:bg-app-accent-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
                >
                  {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  {activeModal === 'addRoom' ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-app-bg border border-app-danger-border rounded-2xl p-6 shadow-2xl animate-in fade-in duration-200">
            <h3 className="text-lg font-bold text-app-danger mb-2 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-app-danger" />
              Confirm Delete
            </h3>
            
            <p className="text-sm text-app-text-secondary leading-relaxed mb-4">
              Are you sure you want to delete <span className="font-semibold text-app-text-primary">"{deleteConfirm.title}"</span>? 
              {deleteConfirm.type === 'property' && ' This action will delete all nested rooms. '}
              This cannot be undone.
            </p>

            <div className="flex gap-3 justify-end pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold text-app-text-secondary hover:text-app-text-primary transition-colors border border-transparent disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={deleteConfirm.type === 'property' ? handleDeleteProperty : handleDeleteRoom}
                disabled={actionLoading}
                className="px-4 py-2 text-xs font-semibold uppercase tracking-wider bg-app-danger hover:bg-app-danger-hover text-white rounded-lg transition-colors flex items-center gap-1.5 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {actionLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;