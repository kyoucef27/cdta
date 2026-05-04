import { fetchClient } from './api';

export const MessageService = {
  /**
   * Submit a contact message (Public)
   */
  async submit(data: { name: string; email: string; subject?: string; message: string }) {
    return fetchClient('/contact', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * List all messages (Admin)
   */
  async getAll() {
    return fetchClient('/messages');
  },

  /**
   * Mark message as read (Admin)
   */
  async markAsRead(id: number) {
    return fetchClient(`/messages/${id}/read`, {
      method: 'PUT',
    });
  },

  /**
   * Delete message (Admin)
   */
  async delete(id: number) {
    return fetchClient(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
};
