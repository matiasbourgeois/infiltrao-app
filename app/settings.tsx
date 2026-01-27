import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, Linking, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ChevronLeft, Share2, MessageSquare, Twitter, Instagram, Crown, ShieldCheck, Zap } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../constants/theme";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useHaptics } from "../hooks/useHaptics";
import { useDeckStore } from "../store/useDeckStore";
import { useSettingsStore } from "../store/useSettingsStore";

export default function Settings() {
    const { isPremium, setPremium } = useDeckStore();
    const { hapticsEnabled, familyMode, toggleHaptics, toggleFamilyMode } = useSettingsStore();
    const haptics = useHaptics();

    const handleTogglePremium = () => {
        haptics.success();
        setPremium(!isPremium);
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-6 pt-6">
                    {/* Header */}
                    <View className="flex-row items-center mb-10">
                        <TouchableOpacity
                            onPress={() => { haptics.light(); router.back(); }}
                            className="w-12 h-12 bg-white rounded-2xl shadow-xl items-center justify-center border border-gray-100"
                        >
                            <ChevronLeft size={24} color={COLORS.gray[900]} />
                        </TouchableOpacity>
                        <Text className="ml-6 text-4xl font-black text-gray-900 tracking-tighter">Ajustes</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        {/* Premium Card */}
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.premiumCardContainer}
                        >
                            <LinearGradient
                                colors={GRADIENTS.primary}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.premiumCard}
                            >
                                <View className="flex-row justify-between items-start">
                                    <View>
                                        <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
                                            <Text className="text-white font-black text-[10px] uppercase tracking-widest">
                                                {isPremium ? "ACTIVADO" : "LIMITED EDITION"}
                                            </Text>
                                        </View>
                                        <Text className="text-white text-3xl font-black mb-2 tracking-tighter">INFILTRAO PRO</Text>
                                        <Text className="text-white/70 font-medium text-xs max-w-[180px]">
                                            Desbloqueá mazos ilimitados y sacá las publicidades.
                                        </Text>
                                    </View>
                                    <MotiView
                                        animate={{ rotate: ['0deg', '10deg', '-10deg', '0deg'] }}
                                        transition={{ loop: true, duration: 3000, type: 'timing' }}
                                    >
                                        <Crown size={64} color="white" opacity={0.3} />
                                    </MotiView>
                                </View>

                                <TouchableOpacity
                                    onPress={handleTogglePremium}
                                    activeOpacity={0.9}
                                    className="bg-white mt-8 py-4 rounded-3xl items-center shadow-2xl"
                                >
                                    <Text className="text-primary font-black uppercase tracking-widest">
                                        {isPremium ? "DISFRUTAR PRO" : "VOLVERTE DIOS"}
                                    </Text>
                                </TouchableOpacity>
                            </LinearGradient>
                        </MotiView>

                        {/* Settings Groups */}
                        <View className="mt-10">
                            <Text className="text-gray-400 font-black text-xs uppercase tracking-[4px] mb-6">GENERAL</Text>

                            <View className="bg-gray-50 rounded-[32px] p-6 border border-gray-100 mb-8">
                                <View className="flex-row items-center justify-between py-2 mb-4">
                                    <View className="flex-row items-center">
                                        <View className="bg-white p-3 rounded-2xl shadow-sm mr-4">
                                            <Zap size={20} color={COLORS.primary.DEFAULT} />
                                        </View>
                                        <Text className="text-gray-900 font-black text-lg">Haptics (Vibración)</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#E2E8F0", true: COLORS.primary.DEFAULT }}
                                        thumbColor="#FFFFFF"
                                        value={hapticsEnabled}
                                        onValueChange={() => { haptics.light(); toggleHaptics(); }}
                                    />
                                </View>

                                <View className="w-full h-[1px] bg-gray-200/50 mb-4" />

                                <View className="flex-row items-center justify-between py-2">
                                    <View className="flex-row items-center">
                                        <View className="bg-white p-3 rounded-2xl shadow-sm mr-4">
                                            <ShieldCheck size={20} color={COLORS.primary.DEFAULT} />
                                        </View>
                                        <Text className="text-gray-900 font-black text-lg">Modo Familiar</Text>
                                    </View>
                                    <Switch
                                        trackColor={{ false: "#E2E8F0", true: COLORS.primary.DEFAULT }}
                                        thumbColor="#FFFFFF"
                                        value={familyMode}
                                        onValueChange={() => { haptics.light(); toggleFamilyMode(); }}
                                    />
                                </View>
                            </View>

                            <Text className="text-gray-400 font-black text-xs uppercase tracking-[4px] mb-6">COMUNIDAD</Text>

                            <View className="flex-row flex-wrap justify-between">
                                <SocialButton icon={<Instagram size={24} color="#E4405F" />} label="Instagram" url="https://instagram.com/infiltrao.app" />
                                <SocialButton icon={<Twitter size={24} color="#1DA1F2" />} label="Twitter" url="https://twitter.com/infiltrao_app" />
                                <SocialButton icon={<Share2 size={24} color={COLORS.primary.DEFAULT} />} label="Compartir" url="https://infiltrao.app" />
                                <SocialButton icon={<MessageSquare size={24} color="#25D366" />} label="Soporte" url="mailto:hola@infiltrao.app" />
                            </View>
                        </View>

                        <View className="items-center py-12">
                            <Text className="text-gray-300 font-bold text-[10px] uppercase tracking-[5px]">INFILTRAO v1.0 - ALPHA</Text>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView>
        </View>
    );
}

function SocialButton({ icon, label, url }: { icon: React.ReactNode, label: string, url?: string }) {
    return (
        <TouchableOpacity
            className="w-[48%] bg-white border border-gray-100 p-6 rounded-[32px] items-center mb-4 shadow-sm"
            onPress={() => {
                Linking.openURL(url || "https://instagram.com").catch(() => { });
            }}
        >
            <View className="mb-3">{icon}</View>
            <Text className="text-gray-900 font-black text-xs uppercase tracking-widest">{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    premiumCardContainer: {
        shadowColor: COLORS.primary.DEFAULT,
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
        elevation: 15,
    },
    premiumCard: {
        padding: 32,
        borderRadius: 48,
    }
});
