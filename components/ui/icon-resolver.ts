// components/ui/icon-resolver.ts (Nouveau fichier)
import * as LucideIcons from "lucide-react";

// Liste des icônes qui seront utilisées
const IconMap: { [key: string]: any } = {
  Code2: LucideIcons.Code2,
  PenTool: LucideIcons.PenTool,
  Megaphone: LucideIcons.Megaphone,
  Briefcase: LucideIcons.Briefcase,
  Video: LucideIcons.Video,
  UserCog: LucideIcons.UserCog,
  Shield: LucideIcons.Shield,
  // Ajouter toutes les autres icônes utilisées par le DOMAIN_MAP ici
};

// Fonction de résolution
export const resolveIcon = (iconName: string) => {
  // Fournir une icône par défaut si le nom est introuvable
  return IconMap[iconName] || LucideIcons.Zap;
};
