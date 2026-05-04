import { fetchClient } from './api';

export const ServiceService = {
  getAll: () => fetchClient('/services'),
  getById: (id: string | number) => fetchClient(`/services/${id}`),
  create: (data: any) => fetchClient('/services', { method: 'POST', body: JSON.stringify(data) }),
  update: (id: string | number, data: any) => fetchClient(`/services/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string | number) => fetchClient(`/services/${id}`, { method: 'DELETE' }),
  updateImage: (id: string | number, formData: FormData) => fetchClient(`/services/${id}/image`, { method: 'POST', body: formData }),
  deleteImage: (id: string | number) => fetchClient(`/services/${id}/image`, { method: 'DELETE' }),
};
