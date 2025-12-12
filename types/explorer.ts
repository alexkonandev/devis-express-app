export interface UIItem {
  id: string;
  title: string;
  description: string;
  defaultPrice: number;
  category: string;
  iconName?: string; // Optionnel, pour mapping d'icônes Lucide
}

export interface UICategory {
  id: string;
  label: string;
  items: UIItem[];
}

export interface UIDomain {
  id: string;
  label: string;
  iconName: string; // ex: "Code", "PenTool", etc.
  categories: UICategory[];
  color?: string; // ex: "text-blue-600" pour le branding visuel
}
