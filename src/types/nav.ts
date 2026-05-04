export interface NavGrandchild {
  id: number;
  label: string;
  url: string;
  is_external: boolean;
}

export interface NavChild {
  id: number;
  label: string;
  url: string;
  is_external: boolean;
  children: NavGrandchild[];
}

export interface NavSection {
  heading: string | null;
  items: NavChild[];
}

export interface NavItem {
  id: number;
  label: string;
  url: string;
  has_intro_card: boolean;
  intro_card_image?: string | null;
  intro_card_button_label?: string | null;
  intro_card_url?: string | null;
  sections?: NavSection[];
}