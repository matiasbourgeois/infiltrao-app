import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { router } from "expo-router";
import { User, ArrowRight, ShieldAlert, Fingerprint, Sparkles } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { MotiView, AnimatePresence } from "moti";
import { useHaptics } from "../../hooks/useHaptics";
import { LinearGradient } from "expo-linear-gradient";

export default function RoleReveal() {
    const {
        players,
        currentPlayerIndex,
        nextPlayer,
        currentDeck
    } = useGameStore();
    const haptics = useHaptics();

    const [isRevealed, setIsRevealed] = useState(false);

    // Ensure we are revealed = false when player changes
    useEffect(() => {
        setIsRevealed(false);
    }, [currentPlayerIndex]);

    const currentPlayer = players[currentPlayerIndex];

    if (!currentPlayer) {
        return null;
    }

    const handleReveal = () => {
        haptics.heavy();
        setIsRevealed(true);
    };

    const handleNext = () => {
        haptics.medium();
        if (currentPlayerIndex < players.length - 1) {
            nextPlayer();
        } else {
            nextPlayer();
            // Store's nextPlayer handles gamePhase: "playing"
            router.replace("/game/round");
        }
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#F5F3FF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-8 pt-6">
                    {/* Progress Bar */}
                    <View className="flex-row h-1.5 bg-gray-100 rounded-full mb-8 overflow-hidden border border-white/50">
                        <MotiView
                            animate={{ width: `${((currentPlayerIndex + 1) / players.length) * 100}%` }}
                            transition={{ type: 'spring', damping: 15 }}
                            className="h-full bg-primary"
                        />
                    </View>

                    <View className="mb-6 items-center">
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-primary/10 px-6 py-2 rounded-full mb-3"
                        >
                            <Text className="text-primary font-black text-[10px] uppercase tracking-[5px]">
                                JUGADOR {currentPlayerIndex + 1} / {players.length}
                            </Text>
                        </MotiView>
                        <Text className="text-4xl font-black text-gray-900 tracking-tighter">
                            {currentPlayer.name.toUpperCase()}
                        </Text>
                    </View>

                    {/* Main Interaction Area - Keyed by Player Index to force re-render on player change */}
                    <View className="flex-1 justify-center items-center py-4" key={currentPlayerIndex}>
                        {!isRevealed ? (
                            <MotiView
                                from={{ opacity: 0, scale: 0.95, translateY: 20 }}
                                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                                className="w-full"
                            >
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={handleReveal}
                                    className="w-full"
                                >
                                    <Card animate={false} className="items-center justify-center bg-white border-0 shadow-2xl rounded-[48px] p-10 min-h-[350px]">
                                        <LinearGradient
                                            colors={['#FFFFFF', '#F8FAFC']}
                                            className="absolute inset-0"
                                        />
                                        <View className="bg-primary/5 p-8 rounded-full mb-6">
                                            <Fingerprint size={80} color={COLORS.primary.DEFAULT} opacity={0.6} />
                                        </View>
                                        <Text className="text-3xl font-black text-gray-900 text-center px-4 tracking-tighter">
                                            TOCÁ PARA{"\n"}REVELAR
                                        </Text>
                                        <View className="flex-row items-center mt-6 px-6 bg-gray-50 py-2.5 rounded-2xl">
                                            <Sparkles size={14} color={COLORS.primary.DEFAULT} className="mr-2" />
                                            <Text className="text-gray-400 text-center font-bold text-[10px]">
                                                SÓLO VOS PODÉS VER ESTO
                                            </Text>
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            </MotiView>
                        ) : (
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="w-full"
                            >
                                <Card
                                    animate={false}
                                    className={`items-center justify-center p-10 min-h-[400px] overflow-hidden border-0 shadow-2xl rounded-[48px] ${currentPlayer.role === "Impostor" ? "bg-secondary" : "bg-primary"
                                        }`}
                                >
                                    <LinearGradient
                                        colors={currentPlayer.role === "Impostor" ? GRADIENTS.secondary : GRADIENTS.primary}
                                        className="absolute inset-0"
                                    />

                                    <MotiView
                                        from={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', damping: 12 }}
                                        className="bg-white/20 p-6 rounded-full mb-4"
                                    >
                                        {currentPlayer.role === "Impostor" ? (
                                            <ShieldAlert size={60} color="white" />
                                        ) : (
                                            <User size={60} color="white" />
                                        )}
                                    </MotiView>

                                    <Text className="text-white/70 font-black uppercase tracking-[6px] text-[10px] mb-1">
                                        TU ROL SECRETO ES
                                    </Text>
                                    <Text className="text-white text-6xl font-black mb-8 text-shadow-lg tracking-tighter text-center">
                                        {currentPlayer.role === "Civil" ? "PUEBLO" : "INFILTRAO"}
                                    </Text>

                                    <View className="w-full h-[1px] bg-white/20 mb-8 rounded-full" />

                                    {currentPlayer.role === "Civil" ? (
                                        <View className="items-center w-full">
                                            <Text className="text-white/60 font-black uppercase tracking-widest text-[10px] mb-3">
                                                PALABRA CLAVE
                                            </Text>
                                            <View className="bg-white w-full py-6 rounded-[32px] shadow-2xl items-center justify-center border-b-8 border-gray-100">
                                                <Text className="text-4xl font-black text-primary tracking-tighter">
                                                    {currentPlayer.secretWord?.toUpperCase()}
                                                </Text>
                                            </View>
                                        </View>
                                    ) : (
                                        <View className="items-center px-4 w-full">
                                            <View className="bg-black/20 p-6 rounded-[28px] border border-white/20 w-full">
                                                <Text className="text-white font-black text-center text-xl leading-7">
                                                    ¡INFILTRATE!{"\n"}
                                                    Descubrí la palabra{"\n"}
                                                    antes que te voten.
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </Card>
                            </MotiView>
                        )}
                    </View>

                    {/* Button Area */}
                    <View className="pb-8 pt-4 min-h-[100px] justify-end">
                        <AnimatePresence>
                            {isRevealed && (
                                <MotiView
                                    from={{ opacity: 0, translateY: 20 }}
                                    animate={{ opacity: 1, translateY: 0 }}
                                    exit={{ opacity: 0, translateY: 10 }}
                                >
                                    <Button
                                        label={currentPlayerIndex < players.length - 1 ? "PASAR AL SIGUIENTE" : "¡A JUGAR!"}
                                        size="xl"
                                        onPress={handleNext}
                                        variant={currentPlayer.role === "Impostor" ? "secondary" : "primary"}
                                        icon={<ArrowRight size={24} color="white" />}
                                        className="h-20"
                                    />
                                </MotiView>
                            )}
                        </AnimatePresence>
                    </View>
                </View>
            </SafeAreaView>
        </View>
    );
}
