import { fetchClient } from './api';

export const EventService = {
  getAll: () => fetchClient('/events'),
  getById: (id: string | number) => fetchClient(`/events/${id}`),
  create: (data: any) => fetchClient('/events', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => fetchClient(`/events/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string | number) => fetchClient(`/events/${id}`, { method: 'DELETE' }),
  updateImage: (id: string | number, formData: FormData) => fetchClient(`/events/${id}/image`, { method: 'POST', body: formData }),
  deleteImage: (id: string | number) => fetchClient(`/events/${id}/image`, { method: 'DELETE' }),
};
