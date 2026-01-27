import { Stack } from "expo-router";
import "../global.css";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: "#F5F5F5" },
                    }}
                >
                    <Stack.Screen name="index" />
                </Stack>
                <StatusBar style="dark" />
            </GestureHandlerRootView>
        </SafeAreaProvider>
    );
}
