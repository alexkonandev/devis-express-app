// @/lib/notifications.ts
import { toast } from "sonner";

/**
 * @utility notify
 * @description Centralise les feedbacks visuels avec un design industriel.
 */
export const notify = {
  success: (title: string, description?: string) => {
    toast.success(title.toUpperCase(), {
      description: description?.toUpperCase(),
      className:
        "rounded-none border-l-4 border-l-emerald-500 bg-white font-sans",
      descriptionClassName:
        "text-[10px] font-bold text-slate-500 tracking-widest",
    });
  },

  error: (title: string, description?: string) => {
    toast.error(title.toUpperCase(), {
      description: description?.toUpperCase(),
      className: "rounded-none border-l-4 border-l-rose-500 bg-white font-sans",
      descriptionClassName:
        "text-[10px] font-bold text-slate-500 tracking-widest",
    });
  },

  info: (title: string, description?: string) => {
    toast.info(title.toUpperCase(), {
      description: description?.toUpperCase(),
      className:
        "rounded-none border-l-4 border-l-indigo-600 bg-white font-sans",
      descriptionClassName:
        "text-[10px] font-bold text-slate-500 tracking-widest",
    });
  },
};
