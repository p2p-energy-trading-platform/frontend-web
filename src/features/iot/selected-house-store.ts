import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SelectedHouseState {
  houseId: string | null;
  setHouseId: (houseId: string) => void;
}

/** The house the user is looking at, remembered in this browser. */
export const useSelectedHouseStore = create<SelectedHouseState>()(
  persist(
    (set) => ({
      houseId: null,
      setHouseId: (houseId) => set({ houseId }),
    }),
    { name: 'gridx-selected-house' },
  ),
);
