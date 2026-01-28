import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeckStore } from "../store/useDeckStore";
import { useGameStore } from "../store/useGameStore";
import { DeckCard } from "../components/DeckCard";
import { Button } from "../components/Button";
import { router } from "expo-router";
import { Settings, Sparkles, TrendingUp } from "lucide-react-native";
import { COLORS } from "../constants/theme";
import { MotiView, MotiText } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useHaptics } from "../hooks/useHaptics";
import { INITIAL_DECKS } from "../data/decks";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 48; // Full width with padding
const SPACER = (width - CARD_WIDTH) / 2;

export default function Home() {
    const customDecks = useDeckStore(state => state.customDecks);
    const { setDeck } = useGameStore();
    const [selectedDeckId, setSelectedDeckId] = useState<string | null>(null);
    const haptics = useHaptics();

    // Combining decks reactively
    const decks = [...INITIAL_DECKS, ...customDecks];

    useEffect(() => {
        if (decks.length > 0 && !selectedDeckId) {
            setSelectedDeckId(decks[0].id);
        }
    }, [decks, selectedDeckId]);

    const handleStartGame = () => {
        const selectedDeck = decks.find((d) => d.id === selectedDeckId);
        if (selectedDeck) {
            setDeck(selectedDeck);
            haptics.success();
            router.push("/game/setup");
        }
    };

    return (
        <View className="flex-1 bg-white">
            {/* God-Tier Mesh Background */}
            <View style={StyleSheet.absoluteFillObject}>
                <LinearGradient
                    colors={['#F5F3FF', '#FFFFFF']}
                    className="flex-1"
                />
                <MotiView
                    from={{ scale: 1, opacity: 0.1, translateX: -200, translateY: -200 }}
                    animate={{ scale: 1.5, opacity: 0.2, translateX: 0, translateY: 0 }}
                    transition={{ duration: 10000, loop: true, type: 'timing', repeatReverse: true }}
                    style={{ position: 'absolute', top: 0, left: 0, width: 400, height: 400, borderRadius: 200, backgroundColor: COLORS.primary.DEFAULT }}
                />
                <MotiView
                    from={{ scale: 1.2, opacity: 0.1, translateX: 200, translateY: 400 }}
                    animate={{ scale: 1.8, opacity: 0.15, translateX: 0, translateY: 200 }}
                    transition={{ duration: 12000, loop: true, type: 'timing', repeatReverse: true }}
                    style={{ position: 'absolute', top: 0, right: 0, width: 350, height: 350, borderRadius: 175, backgroundColor: COLORS.secondary.DEFAULT }}
                />
            </View>

            <SafeAreaView className="flex-1">
                <View className="flex-1">
                    {/* Header */}
                    <View className="px-8 pt-6 flex-row justify-between items-center mb-8">
                        <MotiView
                            from={{ opacity: 0, translateX: -20 }}
                            animate={{ opacity: 1, translateX: 0 }}
                            className="flex-row items-center"
                        >
                            <View className="bg-primary/10 p-2 rounded-xl mr-3">
                                <Sparkles size={24} color={COLORS.primary.DEFAULT} />
                            </View>
                            <View>
                                <Text className="text-3xl font-black text-gray-900 tracking-tighter">INFILTRAO</Text>
                                <Text className="text-primary font-bold text-[8px] uppercase tracking-[3px] mt-[-4px]">
                                    EL JUEGO DEL PUEBLO
                                </Text>
                            </View>
                        </MotiView>

                        <TouchableOpacity
                            onPress={() => { haptics.light(); router.push("/settings"); }}
                            className="w-12 h-12 bg-white rounded-2xl shadow-lg items-center justify-center border border-gray-50"
                        >
                            <Settings size={22} color={COLORS.gray[800]} />
                        </TouchableOpacity>
                    </View>

                    {/* Hero */}
                    <View className="px-8 mb-10">
                        <MotiText
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="text-5xl font-black text-gray-900 tracking-tighter leading-[48px]"
                        >
                            Desconfiá de{"\n"}
                            <Text className="text-primary">tus amigos.</Text>
                        </MotiText>
                    </View>

                    {/* Deck Carousel */}
                    <View className="flex-1 overflow-visible">
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: SPACER, paddingBottom: 20 }}
                            snapToInterval={CARD_WIDTH + 16}
                            decelerationRate="fast"
                            scrollEventThrottle={16}
                        >
                            {decks.map((deck) => (
                                <View
                                    key={deck.id}
                                    style={{ width: CARD_WIDTH, marginRight: 16 }}
                                >
                                    <DeckCard
                                        deck={deck}
                                        isSelected={selectedDeckId === deck.id}
                                        onPress={() => setSelectedDeckId(deck.id)}
                                        variant="carousel"
                                    />
                                </View>
                            ))}

                            <View style={{ width: CARD_WIDTH }}>
                                <DeckCard
                                    deck={null}
                                    isPlaceholder
                                    onPress={() => router.push("/decks/create")}
                                    variant="carousel"
                                />
                            </View>
                        </ScrollView>
                    </View>

                    {/* Start Button Area */}
                    <MotiView
                        from={{ opacity: 0, translateY: 50 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        transition={{ delay: 800 }}
                        className="px-8 pb-10 pt-4"
                    >
                        <Button
                            label="¡A JUGAR!"
                            size="xl"
                            onPress={handleStartGame}
                            disabled={!selectedDeckId}
                            className="h-20"
                        />
                        <TouchableOpacity
                            onPress={() => router.push("/decks")}
                            className="mt-6 items-center"
                        >
                            <Text className="text-gray-400 font-black text-xs uppercase tracking-[4px]">
                                GESTIONAR MAZOS
                            </Text>
                        </TouchableOpacity>
                    </MotiView>
                </View>
            </SafeAreaView>
        </View>
    );
}
