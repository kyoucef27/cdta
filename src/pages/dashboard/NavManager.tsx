import React, { useState, useEffect } from 'react';
import { ContentManager } from './ContentManager';
import { NavService } from '../../services/nav.service';
import type { ColumnDef, FieldDef } from './types';

export const NavManager = () => {
  const [parentOptions, setParentOptions] = useState<{ value: string; label: string }[]>([]);

  useEffect(() => {
    const fetchParents = async () => {
      try {
        const items = await NavService.getAll();
        const parents = items
          .filter((item: any) => !item.parent_id)
          .map((item: any) => ({
            value: String(item.id),
            label: item.label,
          }));
        setParentOptions(parents);
      } catch (err) {
        console.error('Failed to fetch parent nav items', err);
      }
    };
    fetchParents();
  }, []);

  const columns: ColumnDef[] = [
    {
      key: 'label',
      label: 'Label',
      render: row => (
        <span style={{ fontWeight: 600, color: '#0f172a' }}>{row.label}</span>
      ),
    },
    {
      key: 'url',
      label: 'URL',
      render: row => <code style={{ fontSize: 12, color: '#64748b' }}>{row.url}</code>,
    },
    {
      key: 'parent',
      label: 'Parent',
      render: row => row.parent ? row.parent.label : <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>None (Top Level)</span>,
    },
    {
      key: 'section_heading',
      label: 'Section',
      render: row => row.section_heading || '—',
    },
    {
      key: 'order',
      label: 'Order',
      width: 80,
    },
  ];

  const fields: FieldDef[] = [
    { key: 'label', label: 'Label', type: 'text', required: true, placeholder: 'Home, About, etc.' },
    { key: 'url', label: 'URL', type: 'text', required: true, placeholder: '/about or https://...' },
    { 
      key: 'parent_id', 
      label: 'Parent Item', 
      type: 'select', 
      options: parentOptions,
      placeholder: 'Select a parent if this is a child item'
    },
    { key: 'section_heading', label: 'Section Heading', type: 'text', placeholder: 'e.g., Services (for mega-menus)' },
    { key: 'order', label: 'Sort Order', type: 'text', placeholder: '0' },
    { 
      key: 'is_external', 
      label: 'External Link?', 
      type: 'select',
      options: [
        { value: '0', label: 'No' },
        { value: '1', label: 'Yes (Opens in new tab)' }
      ]
    },
    { 
        key: 'has_intro_card', 
        label: 'Show Intro Card? (Top Level Only)', 
        type: 'select',
        options: [
          { value: '0', label: 'No' },
          { value: '1', label: 'Yes' }
        ]
      },
  ];

  const icon = (
    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );

  return (
    <ContentManager
      title="Navigation"
      entityName="Nav Item"
      accentColor="#6366f1"
      accentBg="rgba(99,102,241,0.12)"
      columns={columns}
      fields={fields}
      service={NavService}
      icon={icon}
      toFormValues={row => ({
        label: row.label ?? '',
        url: row.url ?? '',
        parent_id: row.parent_id ? String(row.parent_id) : '',
        section_heading: row.section_heading ?? '',
        order: String(row.order ?? 0),
        is_external: row.is_external ? '1' : '0',
        has_intro_card: row.has_intro_card ? '1' : '0',
      })}
    />
  );
};
