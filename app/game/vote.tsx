import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../../components/Button";
import { router } from "expo-router";
import { ShieldAlert, User, CheckCircle2, Trophy, Skull, Users, ArrowRight, Sparkles } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { MotiView, AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useHaptics } from "../../hooks/useHaptics";

const { width } = Dimensions.get("window");

export default function GameVote() {
    const { players, setWinner, resetGame } = useGameStore();
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | null>(null);
    const [isConfirmed, setIsConfirmed] = useState(false);
    const haptics = useHaptics();

    const handleSelect = (id: number) => {
        haptics.light();
        setSelectedPlayerId(id);
    };

    const handleConfirm = () => {
        if (selectedPlayerId === null) return;
        haptics.heavy();
        setIsConfirmed(true);

        const votedPlayer = players.find(p => p.id === selectedPlayerId);
        if (votedPlayer?.role === "Impostor") {
            setWinner("Civiles");
        } else {
            setWinner("Impostor");
        }
    };

    const handleNewGame = () => {
        haptics.medium();
        resetGame();
        router.replace("/");
    };

    const { winner } = useGameStore.getState();

    if (isConfirmed) {
        const isCivilWin = winner === "Civiles";
        return (
            <View className="flex-1 bg-white">
                <LinearGradient
                    colors={isCivilWin ? ['#F5F3FF', '#FFFFFF'] : ['#FFF1F2', '#FFFFFF']}
                    className="absolute inset-0"
                />
                <SafeAreaView className="flex-1">
                    <View className="flex-1 px-8 items-center justify-center">
                        <MotiView
                            from={{ scale: 0.5, opacity: 0, rotate: '-20deg' }}
                            animate={{ scale: 1, opacity: 1, rotate: '0deg' }}
                            transition={{ type: 'spring', damping: 10 }}
                            className="bg-white p-12 rounded-[64px] shadow-2xl items-center border border-gray-50 relative overflow-hidden"
                        >
                            <LinearGradient
                                colors={isCivilWin ? GRADIENTS.primary : GRADIENTS.secondary}
                                className="w-32 h-32 rounded-full items-center justify-center mb-8 shadow-2xl"
                            >
                                {isCivilWin ? (
                                    <Trophy size={64} color="white" />
                                ) : (
                                    <Skull size={64} color="white" />
                                )}
                            </LinearGradient>

                            <Text className="text-gray-400 font-black text-xs uppercase tracking-[5px] mb-2">RESULTADO FINAL</Text>
                            <View className="items-center mb-8">
                                <Text className={`text-2xl font-black text-center tracking-[8px] mb-2 ${isCivilWin ? "text-primary/60" : "text-secondary/60"}`}>
                                    ¡GANÓ EL
                                </Text>
                                <Text
                                    className={`text-6xl font-black text-center tracking-tighter ${isCivilWin ? "text-primary" : "text-secondary"}`}
                                    numberOfLines={1}
                                    adjustsFontSizeToFit
                                    style={{ width: width * 0.8 }}
                                >
                                    {isCivilWin ? "PUEBLO!" : "INFILTRAO!"}
                                </Text>
                            </View>

                            <View className="bg-gray-50 px-8 py-4 rounded-3xl border border-gray-100">
                                <Text className="text-gray-500 font-bold text-center leading-5">
                                    {isCivilWin
                                        ? "Descubrieron al infiltrado a tiempo. ¡Excelente deducción!"
                                        : "El Infiltrao los engañó a todos. ¡Mejor suerte la próxima!"}
                                </Text>
                            </View>

                            <MotiView
                                animate={{ rotate: '360deg' }}
                                transition={{ loop: true, duration: 20000, type: 'timing' }}
                                className="absolute -right-20 -bottom-20 opacity-5"
                            >
                                <Sparkles size={300} color={isCivilWin ? COLORS.primary.DEFAULT : COLORS.secondary.DEFAULT} />
                            </MotiView>
                        </MotiView>

                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            transition={{ delay: 1000 }}
                            className="w-full mt-12"
                        >
                            <Button label="NUEVA PARTIDA" size="xl" onPress={handleNewGame} className="h-20" />
                        </MotiView>
                    </View>
                </SafeAreaView>
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-8 pt-6">
                    {/* Header */}
                    <View className="mb-10">
                        <MotiView
                            from={{ opacity: 0, translateY: -20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="flex-row items-center justify-between"
                        >
                            <View>
                                <Text className="text-4xl font-black text-gray-900 tracking-tighter">Votación</Text>
                                <Text className="text-secondary font-black text-[10px] uppercase tracking-[5px] mt-[-4px]">¿QUIÉN ES EL INFILTRAO?</Text>
                            </View>
                            <View className="bg-secondary/10 p-3 rounded-2xl">
                                <Users size={24} color={COLORS.secondary.DEFAULT} />
                            </View>
                        </MotiView>
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        className="flex-1"
                        contentContainerStyle={{ paddingHorizontal: 4, paddingBottom: 40 }}
                    >
                        <View className="bg-gray-50 p-6 rounded-[32px] border border-gray-100 mb-8">
                            <Text className="text-gray-500 font-bold leading-5 italic">
                                "Debatan y elijan a un sospechoso. Si es el Infiltrao, gana el Pueblo. Si es del Pueblo, ¡el Infiltrao se sale con la suya!"
                            </Text>
                        </View>

                        <View className="flex-row flex-wrap justify-between">
                            {players.map((player, idx) => {
                                const isSelected = selectedPlayerId === player.id;
                                return (
                                    <MotiView
                                        key={player.id}
                                        style={{ width: '48%' }}
                                        animate={{ scale: isSelected ? 1.05 : 1 }}
                                    >
                                        <TouchableOpacity
                                            onPress={() => handleSelect(player.id)}
                                            activeOpacity={0.9}
                                            className={`aspect-[4/5] rounded-[40px] mb-4 p-6 items-center justify-center border-4 ${isSelected ? "bg-white border-secondary shadow-2xl" : "bg-white border-gray-50 shadow-sm"
                                                }`}
                                        >
                                            <View className={`w-20 h-20 rounded-full items-center justify-center mb-4 ${isSelected ? "bg-secondary/10" : "bg-gray-50"}`}>
                                                <User size={40} color={isSelected ? COLORS.secondary.DEFAULT : COLORS.gray[300]} />
                                            </View>
                                            <Text className={`text-xl font-black text-center ${isSelected ? "text-gray-900" : "text-gray-400"}`}>
                                                {player.name}
                                            </Text>
                                            {isSelected && (
                                                <MotiView
                                                    from={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-4 right-4 bg-secondary rounded-full p-1"
                                                >
                                                    <CheckCircle2 size={24} color="white" />
                                                </MotiView>
                                            )}
                                        </TouchableOpacity>
                                    </MotiView>
                                );
                            })}
                        </View>
                    </ScrollView>

                    <MotiView className="pb-10 pt-4">
                        <Button
                            label="CONFIRMAR VOTO"
                            variant="secondary"
                            size="xl"
                            disabled={selectedPlayerId === null}
                            onPress={handleConfirm}
                            icon={<CheckCircle2 size={24} color="white" />}
                            className="h-20"
                        />
                    </MotiView>
                </View>
            </SafeAreaView>
        </View>
    );
}
