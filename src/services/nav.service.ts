import { fetchClient } from './api';

export const NavService = {
  getAll: () => fetchClient('/nav-admin'),
  getPublic: () => fetchClient('/nav'),
  create: (data: any) => fetchClient('/nav-items', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => fetchClient(`/nav-items/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string | number) => fetchClient(`/nav-items/${id}`, { method: 'DELETE' }),
};
