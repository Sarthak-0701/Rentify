import { Building, Edit, Trash2, Plus } from 'lucide-react';
import { RoomItem } from './RoomItem';

export const PropertyCard = ({
  property,
  onEditProperty,
  onDeleteProperty,
  onAddRoom,
  onEditRoom,
  onDeleteRoom,
  onCopyCode,
  onNavigate,
}) => {
  const rooms = property.rooms || [];

  return (
    <div className="p-6 bg-linear-to-b from-app-card-from to-app-card-to border border-app-card-border rounded-2xl shadow-xl flex flex-col justify-between group hover:border-app-card-hover transition-colors relative overflow-hidden">
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-bold text-app-text-primary font-sans flex items-center gap-2">
              <Building className="w-5 h-5 text-app-accent/80" />
              {property.name}
            </h3>
            {property.address && (
              <p className="text-xs text-app-text-muted mt-0.5 pl-7">{property.address}</p>
            )}
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEditProperty(property)}
              title="Edit Property"
              className="p-1.5 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-accent rounded-lg transition-colors cursor-pointer"
            >
              <Edit className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDeleteProperty(property)}
              title="Delete Property"
              className="p-1.5 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-danger rounded-lg transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 border-l-2 border-app-card-border pl-4">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomItem
                key={room.id}
                room={room}
                property={property}
                onEdit={onEditRoom}
                onDelete={onDeleteRoom}
                onCopyCode={onCopyCode}
                onNavigate={onNavigate}
              />
            ))
          ) : (
            <p className="text-xs text-app-text-muted italic py-2 pl-2">No rooms added to this property.</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-app-card-border flex justify-end">
        {rooms.length >= 12 ? (
          <span className="text-[11px] font-bold text-app-text-muted uppercase tracking-wider">
            Max 12 Rooms Reached
          </span>
        ) : (
          <button
            onClick={() => onAddRoom(property)}
            className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-app-text-secondary hover:text-app-accent transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" /> Add Room
          </button>
        )}
      </div>
    </div>
  );
};