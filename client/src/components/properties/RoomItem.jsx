import { Bed, User, Edit, Trash2 } from 'lucide-react';

export const RoomItem = ({ room, property, onEdit, onDelete, onCopyCode, onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate(property.id, room.id)}
      className="group/room flex justify-between items-center p-3 bg-app-card-from border border-app-card-border rounded-xl hover:border-app-card-hover hover:bg-app-card-hover/10 transition-colors cursor-pointer"
    >
      <div className="flex flex-col">
        <span className="text-sm font-semibold text-app-text-primary flex items-center gap-1.5">
          <Bed className="w-3.5 h-3.5 text-app-accent/60" /> Room {room.room_number}
        </span>

        {/* Displays Tenant Name or 'Vacant', AND the copyable Room Invite Code */}
        <div className="flex items-center gap-2 mt-0.5 pl-5">
          <span className="text-[11px] text-app-text-muted flex items-center gap-1">
            <User className="w-2.5 h-2.5" /> {room.tenant_name || 'Vacant'}
          </span>

          {room.tenant_code && (
            <span
              onClick={(e) =>
                onCopyCode(
                  e,
                  room.tenant_code,
                  room.room_number,
                  property.name,
                  room.tenant_name
                )
              }
              className="text-[9px] bg-app-card-to hover:bg-app-accent-glow hover:text-app-accent hover:border-app-accent-border px-1.5 py-0.5 rounded font-mono border border-app-card-border cursor-pointer transition-colors"
              title="Click to copy Room Invite Code"
            >
              ID: {room.tenant_code}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-[11px] font-semibold bg-app-accent-glow text-app-accent px-2.5 py-1 rounded-full border border-app-accent-border flex items-center">
          ₹{Number(room.base_rent).toLocaleString('en-IN')}
        </span>

        {/* Action icons appear on room hover */}
        <div className="flex items-center opacity-0 group-hover/room:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(room);
            }}
            title="Edit Room"
            className="p-1 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-accent rounded-md cursor-pointer transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(room);
            }}
            title="Delete Room"
            className="p-1 hover:bg-app-card-hover/20 text-app-text-secondary hover:text-app-danger rounded-md cursor-pointer transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoomItem;