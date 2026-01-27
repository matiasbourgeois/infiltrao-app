import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { useSettingsStore } from '../store/useSettingsStore';

export const useHaptics = () => {
    const isEnabled = () => {
        return useSettingsStore.getState().hapticsEnabled;
    };

    const light = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
    };

    const medium = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        }
    };

    const heavy = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        }
    };

    const success = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
    };

    const error = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    const warning = () => {
        if (Platform.OS !== 'web' && isEnabled()) {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        }
    };

    return { light, medium, heavy, success, error, warning };
};
