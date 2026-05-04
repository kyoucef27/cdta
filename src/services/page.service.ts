import { fetchClient } from './api';

export const PageService = {
  getAll: () => fetchClient('/pages'),
  getById: (id: string | number) => fetchClient(`/pages/${id}`),
  create: (data: any, image?: File | null, gallery?: File[]) => {
    const fd = new FormData();
    Object.keys(data).forEach(k => fd.append(k, data[k] !== null && data[k] !== undefined ? data[k] : ''));
    if (image) fd.append('image', image);
    if (gallery) gallery.forEach(f => fd.append('gallery_images[]', f));
    return fetchClient('/pages', { method: 'POST', body: fd });
  },
  update: (id: string | number, data: any, image?: File | null, gallery?: File[]) => {
    const fd = new FormData();
    Object.keys(data).forEach(k => fd.append(k, data[k] !== null && data[k] !== undefined ? data[k] : ''));
    if (image) fd.append('image', image);
    if (gallery) gallery.forEach(f => fd.append('gallery_images[]', f));
    fd.append('_method', 'PUT');
    return fetchClient(`/pages/${id}`, { method: 'POST', body: fd });
  },
  delete: (id: string | number) => fetchClient(`/pages/${id}`, { method: 'DELETE' }),
  updateImage: undefined,
  deleteImage: (id: string | number) => fetchClient(`/pages/${id}/image`, { method: 'DELETE' }),
};
