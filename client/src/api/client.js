import { supabase } from '../supabase/client';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = async (endpoint, options = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;

  if (!token) {
    throw new Error('Authentication failed: No active session. Please log in.');
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    ...options.headers,
  };

  let body = options.body;
  if (body && typeof body === 'object') {
    body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    body,
  });

  const text = await response.text();
  let result;
  try {
    result = text ? JSON.parse(text) : {};
  } catch {
    result = { message: text };
  }

  if (!response.ok) {
    throw new Error(result.message || result.error || `HTTP ${response.status}: Request failed`);
  }

  return result;
};

export const api = {
  // Properties
  getProperties: () => apiClient('/properties'),
  createProperty: (payload) =>
    apiClient('/properties', {
      method: 'POST',
      body: payload,
    }),
  updateProperty: (id, payload) =>
    apiClient(`/properties/${id}`, {
      method: 'PUT',
      body: payload,
    }),
  deleteProperty: (id) =>
    apiClient(`/properties/${id}`, {
      method: 'DELETE',
    }),

  // Rooms
  getRoomById: (id) => apiClient(`/rooms/${id}`),
  createRoom: (payload) =>
    apiClient('/rooms', {
      method: 'POST',
      body: payload,
    }),
  updateRoom: (id, payload) =>
    apiClient(`/rooms/${id}`, {
      method: 'PUT',
      body: payload,
    }),
  deleteRoom: (id) =>
    apiClient(`/rooms/${id}`, {
      method: 'DELETE',
    }),

  // Tenancies
  requestTenancyLink: (inviteCode) =>
    apiClient('/tenancies/request-link', { 
      method: 'POST', 
      body: { invite_code: inviteCode } 
    }),
  getTenantRequests: () => 
    apiClient('/tenancies/my-requests'),
  cancelTenantRequest: (id) => 
    apiClient(`/tenancies/cancel-request/${id}`, { 
      method: 'DELETE' 
    }),
  getTenantActiveRentals: () =>
    apiClient('/tenancies/my-rentals'),
  getOwnerPendingRequests: () => 
    apiClient('/tenancies/pending-requests'),
  acceptTenancyRequest: (id) => 
    apiClient(`/tenancies/${id}/accept`, { 
      method: 'POST' 
    }),
  declineTenancyRequest: (id) => 
    apiClient(`/tenancies/${id}/decline`, { 
      method: 'POST' 
    }),

  // Receipts
  getReceipts: (page = 1, limit = 50) =>
    apiClient(`/receipts?page=${page}&limit=${limit}`),
  generateReceipt: (billData) =>
    apiClient('/receipts/generate', {
      method: 'POST',
      body: billData,
    }),
  updateReceiptStatus: (id, status) =>
    apiClient(`/receipts/${id}/status`, {
      method: 'PATCH',
      body: { status },
    }),
  updateReceipt: (id, billData) =>
    apiClient(`/receipts/${id}`, {
      method: 'PUT',
      body: billData,
    }),
  deleteReceipt: (id) =>
    apiClient(`/receipts/${id}`, {
      method: 'DELETE',
    }),
};

export default api;