// Shared types for the dashboard content management system

export interface FieldDef {
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'date' | 'url' | 'select' | 'image';
  required?: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface ColumnDef {
  key: string;
  label: string;
  render?: (row: any) => React.ReactNode;
  width?: string | number;
}
