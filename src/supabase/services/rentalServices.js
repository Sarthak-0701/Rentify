import { supabase } from '../client';

export const rentalService = {
  // Fetch properties and their nested rooms for a specific owner
  async getProperties(ownerId) {
    let query = supabase
      .from('properties')
      .select(`
        id,
        name,
        rooms (
          id,
          room_number,
          tenant_name,
          tenant_code,
          base_rent
        )
      `)
      .order('created_at', { ascending: false });

    if (ownerId) {
      query = query.eq('owner_id', ownerId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  // Add a new property (maximum 5 properties allowed per owner)
  async addProperty(name) {
    const { data: { user } } = await supabase.auth.getUser();
    
    // Check current property count
    const { data: currentProperties, error: countError } = await supabase
      .from('properties')
      .select('id')
      .eq('owner_id', user.id);

    if (countError) throw countError;
    if (currentProperties && currentProperties.length >= 5) {
      throw new Error("You have reached the maximum limit of 5 properties.");
    }

    const { data, error } = await supabase
      .from('properties')
      .insert([{ name, owner_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update/Edit property name
  async updateProperty(propertyId, name) {
    const { data, error } = await supabase
      .from('properties')
      .update({ name })
      .eq('id', propertyId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an existing property
  async deleteProperty(propertyId) {
    const { error } = await supabase
      .from('properties')
      .delete()
      .eq('id', propertyId);

    if (error) throw error;
    return true;
  },

  // Add a room to a property (maximum 12 rooms allowed)
  async addRoom(propertyId, roomNumber, tenantName, baseRent) {
    // Check room count
    const { data: currentRooms, error: countError } = await supabase
      .from('rooms')
      .select('id')
      .eq('property_id', propertyId);

    if (countError) throw countError;
    if (currentRooms && currentRooms.length >= 12) {
      throw new Error("This property has already reached the maximum limit of 12 rooms.");
    }

    // Generate 6-digit tenant code if tenant name is provided
    let tenantCode = null;
    const trimmedName = tenantName?.trim();
    if (trimmedName) {
      tenantCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const { data, error } = await supabase
      .from('rooms')
      .insert([{ 
        property_id: propertyId, 
        room_number: roomNumber, 
        tenant_name: trimmedName || null,
        tenant_code: tenantCode, 
        base_rent: parseFloat(baseRent || 0) 
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Update/Edit an existing room
  async updateRoom(roomId, roomNumber, tenantName, baseRent) {
    // Fetch existing room details to manage tenant code
    const { data: existingRoom, error: fetchErr } = await supabase
      .from('rooms')
      .select('tenant_name, tenant_code')
      .eq('id', roomId)
      .single();

    if (fetchErr) throw fetchErr;

    let tenantCode = existingRoom?.tenant_code || null;
    const trimmedName = tenantName?.trim();

    if (!trimmedName) {
      // Room becomes vacant - clear code
      tenantCode = null;
    } else if (!tenantCode) {
      // Room got a new tenant - generate code
      tenantCode = Math.floor(100000 + Math.random() * 900000).toString();
    }

    const { data, error } = await supabase
      .from('rooms')
      .update({ 
        room_number: roomNumber, 
        tenant_name: trimmedName || null,
        tenant_code: tenantCode,
        base_rent: parseFloat(baseRent || 0) 
      })
      .eq('id', roomId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an existing room
  async deleteRoom(roomId) {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);

    if (error) throw error;
    return true;
  },

  // Fetch latest receipts for a property/room, triggers pruning of older receipts
  async getReceipts(propertyId, roomId) {
    // Prune automatically
    try {
      await this.cleanOldReceipts(propertyId, roomId);
    } catch (cleanErr) {
      console.error("Failed to prune older receipts:", cleanErr);
    }

    // Fetch latest 3 receipts
    const { data, error } = await supabase
      .from('receipts')
      .select('*')
      .eq('property_id', propertyId)
      .eq('room_id', roomId)
      .order('billing_date', { ascending: false })
      .limit(3);

    if (error) throw error;
    return data;
  },

  // Prunes receipts beyond the latest 3
  async cleanOldReceipts(propertyId, roomId) {
    const { data, error } = await supabase
      .from('receipts')
      .select('id')
      .eq('property_id', propertyId)
      .eq('room_id', roomId)
      .order('billing_date', { ascending: false });

    if (error) throw error;

    if (data && data.length > 3) {
      const idsToDelete = data.slice(3).map(r => r.id);
      const { error: deleteError } = await supabase
        .from('receipts')
        .delete()
        .in('id', idsToDelete);

      if (deleteError) throw deleteError;
    }
  },

  // Update details of an existing receipt
  async updateReceipt(receiptId, updatedFields) {
    const { data, error } = await supabase
      .from('receipts')
      .update(updatedFields)
      .eq('id', receiptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Delete an existing receipt
  async deleteReceipt(receiptId) {
    const { error } = await supabase
      .from('receipts')
      .delete()
      .eq('id', receiptId);

    if (error) throw error;
    return true;
  },

  // Get property and room details for UI header
  async getRoomDetails(propertyId, roomId) {
    const { data: property, error: propErr } = await supabase
      .from('properties')
      .select('name')
      .eq('id', propertyId)
      .single();

    if (propErr) throw propErr;

    const { data: room, error: roomErr } = await supabase
      .from('rooms')
      .select('room_number, tenant_name, tenant_code')
      .eq('id', roomId)
      .single();

    if (roomErr) throw roomErr;

    return {
      propertyName: property.name,
      roomNumber: room.room_number,
      tenantName: room.tenant_name,
      tenantCode: room.tenant_code
    };
  },

  // Fetch all rooms and statements corresponding to a list of tenant codes
  async getTenantData(tenantCodes) {
    if (!tenantCodes || tenantCodes.length === 0) {
      return { rooms: [], receipts: [], owners: {} };
    }

    // Fetch rooms and join property info
    const { data: rooms, error: roomsErr } = await supabase
      .from('rooms')
      .select(`
        id,
        room_number,
        tenant_name,
        tenant_code,
        base_rent,
        property_id,
        properties (
          id,
          name,
          owner_id
        )
      `)
      .in('tenant_code', tenantCodes);

    if (roomsErr) throw roomsErr;

    // Fetch owner profiles for those rooms
    const ownerIds = Array.from(new Set(rooms.map(r => r.properties?.owner_id).filter(Boolean)));
    const ownersMap = {};
    if (ownerIds.length > 0) {
      const { data: ownerProfiles, error: ownerErr } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', ownerIds);
        
      if (!ownerErr && ownerProfiles) {
        ownerProfiles.forEach(p => {
          ownersMap[p.id] = p.full_name;
        });
      }
    }

    // Fetch all receipts for these rooms
    const { data: receipts, error: receiptsErr } = await supabase
      .from('receipts')
      .select('*')
      .in('tenant_code', tenantCodes)
      .order('billing_date', { ascending: false });

    if (receiptsErr) throw receiptsErr;

    return {
      rooms: rooms || [],
      receipts: receipts || [],
      owners: ownersMap
    };
  },

  // Mark a pending receipt as paid
  async settleReceiptPayment(receiptId) {
    const { data, error } = await supabase
      .from('receipts')
      .update({ status: 'Paid' })
      .eq('id', receiptId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Sync the tenant codes to the user profile table in Supabase
  async syncTenantCodes(userId, codesArray) {
    if (!userId) return;
    try {
      const codesStr = codesArray.join(',');
      const { error } = await supabase
        .from('profiles')
        .update({ tenant_code: codesStr })
        .eq('id', userId);
      
      if (error) {
        // Log warning but don't crash, allowing fallback to localStorage
        console.warn("Could not sync tenant codes to profiles table:", error.message);
      }
    } catch (err) {
      console.warn("Failed to update profile tenant_code column:", err.message);
    }
  },

  // Fetch dashboard summary stats for a specific owner
  async getOwnerDashboardStats(ownerId) {
    const properties = await this.getProperties(ownerId);
    const { data: receipts, error } = await supabase
      .from('receipts')
      .select('id, property_id, total_bill, status')
      .eq('owner_id', ownerId);
      
    if (error) throw error;
    
    return {
      properties: properties || [],
      receipts: receipts || []
    };
  }
};