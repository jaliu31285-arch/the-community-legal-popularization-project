import { create } from 'zustand';
import { api } from '@/services/api';

export type SiteStyle = 'style-a' | 'style-b' | 'style-c';

interface SiteStyleState {
  style: SiteStyle;
  locked: boolean;
  loading: boolean;
  fetchStyle: () => Promise<void>;
  setStyle: (style: SiteStyle) => void;
}

export const useSiteStyle = create<SiteStyleState>((set) => ({
  style: 'style-a',
  locked: false,
  loading: true,
  fetchStyle: async () => {
    try {
      const settings = await api.getSiteSettings();
      const siteStyle = (settings as any)?.site_style?.setting_value || 'style-a';
      const styleLocked = (settings as any)?.style_locked?.setting_value || '0';
      set({ style: siteStyle as SiteStyle, locked: styleLocked === '1', loading: false });
    } catch {
      set({ loading: false });
    }
  },
  setStyle: (style: SiteStyle) => set({ style }),
}));