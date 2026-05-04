import { fetchClient } from './api';

export const NewsService = {
  getAll: () => fetchClient('/news'),
  getById: (id: string | number) => fetchClient(`/news/${id}`),
  create: (data: any, image?: File | null, gallery?: File[]) => {
    const fd = new FormData();
    Object.keys(data).forEach(k => fd.append(k, data[k] !== null && data[k] !== undefined ? data[k] : ''));
    if (image) fd.append('image', image);
    if (gallery) gallery.forEach(f => fd.append('gallery_images[]', f));
    return fetchClient('/news', { method: 'POST', body: fd });
  },
  update: (id: string | number, data: any, image?: File | null, gallery?: File[]) => {
    const fd = new FormData();
    Object.keys(data).forEach(k => fd.append(k, data[k] !== null && data[k] !== undefined ? data[k] : ''));
    if (image) fd.append('image', image);
    if (gallery) gallery.forEach(f => fd.append('gallery_images[]', f));
    fd.append('_method', 'PUT'); // Laravel method spoofing
    return fetchClient(`/news/${id}`, { method: 'POST', body: fd });
  },
  delete: (id: string | number) => fetchClient(`/news/${id}`, { method: 'DELETE' }),
  updateImage: undefined, // handled in create/update directly now
  deleteImage: (id: string | number) => fetchClient(`/news/${id}/image`, { method: 'DELETE' }),
};
