import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeckStore } from "../../store/useDeckStore";
import { DeckCard } from "../../components/DeckCard";
import { Button } from "../../components/Button";
import { router } from "expo-router";
import { ChevronLeft, Plus, Crown, Sparkles, Layers } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useHaptics } from "../../hooks/useHaptics";
import { INITIAL_DECKS } from "../../data/decks";

export default function DecksManager() {
    const { customDecks, isPremium } = useDeckStore();
    const haptics = useHaptics();

    const decks = [...INITIAL_DECKS, ...customDecks];

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#F5F3FF', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <View className="flex-1">
                    {/* Header */}
                    <View className="px-8 pt-6 flex-row items-center justify-between mb-8">
                        <View className="flex-row items-center">
                            <TouchableOpacity
                                onPress={() => { haptics.light(); router.back(); }}
                                className="w-12 h-12 bg-white rounded-2xl shadow-xl items-center justify-center border border-gray-100"
                            >
                                <ChevronLeft size={24} color={COLORS.gray[900]} />
                            </TouchableOpacity>
                            <View className="ml-6">
                                <Text className="text-4xl font-black text-gray-900 tracking-tighter">Mazos</Text>
                                <Text className="text-primary font-bold text-[10px] uppercase tracking-[4px] mt-[-4px]">
                                    BIBLIOTECA
                                </Text>
                            </View>
                        </View>

                        {!isPremium && (
                            <TouchableOpacity
                                onPress={() => router.push("/settings")}
                                className="bg-amber-400 p-3 rounded-2xl shadow-lg border border-white/20"
                            >
                                <Crown size={20} color="white" />
                            </TouchableOpacity>
                        )}
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1 px-8"
                        contentContainerStyle={{ paddingBottom: 40 }}
                    >
                        {/* Premium Promo Section */}
                        {!isPremium && (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-10"
                            >
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                    className="p-8 rounded-[40px] shadow-2xl relative overflow-hidden"
                                >
                                    <View className="flex-row justify-between items-center z-10">
                                        <View className="flex-1 mr-4">
                                            <View className="bg-white/20 self-start px-3 py-1 rounded-full mb-3">
                                                <Text className="text-white font-black text-[9px] uppercase tracking-widest">LIMITED TIME</Text>
                                            </View>
                                            <Text className="text-white text-3xl font-black mb-2 tracking-tighter">SOTA Pro</Text>
                                            <Text className="text-white/70 font-bold text-xs">Desbloqueá todos los mazos y creá sin límites.</Text>
                                        </View>
                                        <Crown size={48} color="white" opacity={0.3} />
                                    </View>
                                    <TouchableOpacity
                                        onPress={() => router.push("/settings")}
                                        className="bg-white mt-6 py-4 rounded-[24px] items-center"
                                    >
                                        <Text className="text-primary font-black uppercase tracking-widest text-xs">OBTENER PRO</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </MotiView>
                        )}

                        <View className="flex-row items-center mb-6">
                            <View className="w-10 h-10 bg-primary/10 rounded-xl items-center justify-center mr-3">
                                <Layers size={18} color={COLORS.primary.DEFAULT} />
                            </View>
                            <Text className="text-2xl font-black text-gray-900 tracking-tight">Tus Colecciones</Text>
                        </View>
                        <View className="flex-1">
                            {decks.map((deck) => (
                                <View key={deck.id} className="w-full mb-3">
                                    <DeckCard
                                        deck={deck}
                                        isSelected={false}
                                        onPress={() => { }}
                                        variant="list"
                                    />
                                </View>
                            ))}

                            <View className="w-full mb-6">
                                <DeckCard
                                    deck={null}
                                    isPlaceholder
                                    onPress={() => router.push("/decks/create")}
                                    variant="list"
                                />
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </SafeAreaView >
        </View >
    );
}
