import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SettingsState {
    hapticsEnabled: boolean;
    familyMode: boolean;
    toggleHaptics: () => void;
    toggleFamilyMode: () => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            hapticsEnabled: true,
            familyMode: false,
            toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
            toggleFamilyMode: () => set((state) => ({ familyMode: !state.familyMode })),
        }),
        {
            name: 'sota-settings-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
