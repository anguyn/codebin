import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIStore {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  isCreateModalOpen: boolean;
  toggleCreateModal: () => void;
}

export const useUIStore = create<UIStore>(set => ({
  isSidebarOpen: false,
  toggleSidebar: () => set(state => ({ isSidebarOpen: !state.isSidebarOpen })),
  isCreateModalOpen: false,
  toggleCreateModal: () =>
    set(state => ({ isCreateModalOpen: !state.isCreateModalOpen })),
}));
