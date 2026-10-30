import { api } from '../../api/client';

export const rentalService = {
  // --- PROPERTIES ---
  getProperties: async () => {
    try {
      const res = await api.getProperties();
      return res.data || [];
    } catch (err) {
      console.error('getProperties error:', err.message);
      return [];
    }
  },

  addProperty: async (propertyData) => {
    const payload =
      typeof propertyData === 'string'
        ? { name: propertyData.trim() }
        : propertyData;
    const res = await api.createProperty(payload);
    return res.data;
  },

  updateProperty: async (propertyId, propertyData) => {
    const res = await api.updateProperty(propertyId, propertyData);
    return res.data;
  },

  deleteProperty: async (propertyId) => {
    const res = await api.deleteProperty(propertyId);
    return res.data;
  },

  // --- ROOMS ---
  getRoomById: async (roomId) => {
    const res = await api.getRoomById(roomId);
    return res.data;
  },

  getRoomDetails: async (propertyId, roomId) => {
    // Supports both (propertyId, roomId) and (roomId) calls
    const targetId = roomId || propertyId;
    const res = await api.getRoomById(targetId);
    return res.data;
  },

  addRoom: async (roomData) => {
    const res = await api.createRoom(roomData);
    return res.data;
  },

  updateRoom: async (roomId, roomData) => {
    const res = await api.updateRoom(roomId, roomData);
    return res.data;
  },

  deleteRoom: async (roomId) => {
    const res = await api.deleteRoom(roomId);
    return res.data;
  },

  // --- TENANCIES ---
  requestTenancyLink: (code) => api.requestTenancyLink(code),
  getTenantRequests: () => api.getTenantRequests(),
  cancelTenantRequest: (id) => api.cancelTenantRequest(id),
  getTenantActiveRentals: async () => {
    try {
      const res = await api.getTenantActiveRentals();
      return res.data || [];
    } catch (err) {
      console.error('getTenantActiveRentals error:', err.message);
      return [];
    }
  },
  getOwnerPendingRequests: () => api.getOwnerPendingRequests(),
  acceptTenancyRequest: (id) => api.acceptTenancyRequest(id),
  declineTenancyRequest: (id) => api.declineTenancyRequest(id),

  // --- RECEIPTS ---
  getReceipts: async (page = 1, limit = 50) => {
    try {
      const res = await api.getReceipts(page, limit);
      return res.data || [];
    } catch (err) {
      console.error('getReceipts error:', err.message);
      return [];
    }
  },

  createReceipt: async (billData) => {
    const res = await api.generateReceipt(billData);
    return res.data;
  },

  updateReceiptStatus: async (receiptId, status) => {
    const res = await api.updateReceiptStatus(receiptId, status);
    return res.data;
  },

  updateReceipt: async (receiptId, billData) => {
    const res = await api.updateReceipt(receiptId, billData);
    return res.data;
  },

  deleteReceipt: async (receiptId) => {
    const res = await api.deleteReceipt(receiptId);
    return res.data;
  },

  // --- DASHBOARD AGGREGATION ---
  getOwnerDashboardStats: async () => {
    try {
      const [propertiesRes, receiptsRes] = await Promise.all([
        api.getProperties(),
        api.getReceipts(1, 100),
      ]);

      return {
        properties: propertiesRes?.data || [],
        receipts: receiptsRes?.data || [],
      };
    } catch (err) {
      console.error('getOwnerDashboardStats error:', err.message);
      throw err;
    }
  },
};

export const rentalServices = rentalService;
export default rentalService;