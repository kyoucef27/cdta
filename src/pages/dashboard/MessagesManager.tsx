import React, { useState, useEffect } from 'react';
import { MessageService } from '../../services/message.service';

interface Message {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  read_at: string | null;
  created_at: string;
}

export const MessagesManager = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await MessageService.getAll();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch messages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleMarkRead = async (id: number) => {
    try {
      await MessageService.markAsRead(id);
      setMessages(messages.map(m => m.id === id ? { ...m, read_at: new Date().toISOString() } : m));
      if (selectedMessage?.id === id) {
        setSelectedMessage({ ...selectedMessage, read_at: new Date().toISOString() });
      }
    } catch (err) {
      console.error('Failed to mark as read', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await MessageService.delete(id);
      setMessages(messages.filter(m => m.id !== id));
      if (selectedMessage?.id === id) setSelectedMessage(null);
    } catch (err) {
      console.error('Failed to delete message', err);
    }
  };

  const filteredMessages = messages.filter(m => {
    if (filter === 'unread') return !m.read_at;
    if (filter === 'read') return !!m.read_at;
    return true;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div style={{ padding: 32, maxWidth: 1200, margin: '0 auto' }}>
      <header style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: '#0f172a', marginBottom: 8 }}>Inbox</h1>
          <p style={{ color: '#64748b' }}>Manage received contact form submissions.</p>
        </div>
        
        <div style={{ display: 'flex', gap: 8, background: '#fff', padding: 4, borderRadius: 12, border: '1px solid #e2e8f0' }}>
          {(['all', 'unread', 'read'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '6px 16px', borderRadius: 8, border: 'none', fontSize: 13, fontWeight: 600,
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
                background: filter === f ? '#0f172a' : 'transparent',
                color: filter === f ? '#fff' : '#64748b'
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: 24, minHeight: '600px' }}>
        {/* List */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
            Messages ({filteredMessages.length})
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading...</div>
            ) : filteredMessages.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>No messages found.</div>
            ) : (
              filteredMessages.map(m => (
                <div
                  key={m.id}
                  onClick={() => {
                    setSelectedMessage(m);
                    if (!m.read_at) handleMarkRead(m.id);
                  }}
                  style={{
                    padding: '16px 20px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer',
                    transition: 'all 0.2s', background: selectedMessage?.id === m.id ? '#f1f5f9' : 'transparent',
                    position: 'relative'
                  }}
                >
                  {!m.read_at && (
                    <div style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', width: 6, height: 6, borderRadius: '50%', background: '#a855f7' }} />
                  )}
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 14, fontWeight: m.read_at ? 500 : 700, color: '#0f172a' }}>{m.name}</span>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(m.created_at).toLocaleDateString()}</span>
                  </div>
                  <div style={{ fontSize: 13, color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {m.subject || '(No Subject)'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detail */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
          {selectedMessage ? (
            <>
              <div style={{ padding: 32, borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
                  <div>
                    <h2 style={{ fontSize: 24, fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{selectedMessage.subject || 'No Subject'}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 14 }}>
                      <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedMessage.name}</span>
                      <span>&lt;{selectedMessage.email}&gt;</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => handleDelete(selectedMessage.id)}
                      style={{ padding: '8px 12px', borderRadius: 8, border: '1px solid #fee2e2', background: '#fef2f2', color: '#ef4444', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: '#94a3b8' }}>
                  Sent on {formatDate(selectedMessage.created_at)}
                </div>
              </div>
              <div style={{ padding: 32, flex: 1, whiteSpace: 'pre-wrap', color: '#334155', lineHeight: 1.6, fontSize: 16 }}>
                {selectedMessage.message}
              </div>
              <div style={{ padding: 24, borderTop: '1px solid #f1f5f9', background: '#f8fafc', borderRadius: '0 0 20px 20px' }}>
                <a 
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                  style={{ display: 'inline-flex', padding: '10px 20px', background: '#0f172a', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 14 }}
                >
                  Reply via Email
                </a>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', flexDirection: 'column', gap: 16 }}>
              <svg width="48" height="48" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
              <span>Select a message to read</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
