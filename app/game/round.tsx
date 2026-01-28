import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../../components/Button";
import { Card } from "../../components/Card";
import { router } from "expo-router";
import { Clock, Eye, Info, HelpCircle, AlertCircle, ArrowRight, Sparkles } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { MotiView, AnimatePresence } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { useHaptics } from "../../hooks/useHaptics";

export default function GameRound() {
    const {
        timerSeconds,
        decrementTimer,
        players,
        currentDeck
    } = useGameStore();
    const haptics = useHaptics();

    const [showSecretModal, setShowSecretModal] = useState(false);
    const [modalPlayerIndex, setModalPlayerIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            decrementTimer();
            if (timerSeconds <= 10 && timerSeconds > 0) {
                haptics.light();
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [timerSeconds]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const handleVote = () => {
        haptics.medium();
        router.push("/game/vote");
    };

    const isExpiring = timerSeconds < 30;

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <View className="flex-1 px-8 pt-6">
                    {/* Timer Hero Section */}
                    <View className="mb-10">
                        <MotiView
                            from={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="w-full"
                        >
                            <LinearGradient
                                colors={isExpiring ? ['#EF4444', '#B91C1C'] : GRADIENTS.primary}
                                start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                                className="p-12 rounded-[48px] shadow-2xl items-center relative overflow-hidden"
                            >
                                <MotiView
                                    animate={{
                                        scale: isExpiring ? [1, 1.1, 1] : 1,
                                    }}
                                    transition={{ loop: true, duration: 1000 }}
                                    className="flex-row items-center mb-4 z-10"
                                >
                                    <Clock size={20} color="white" opacity={0.6} className="mr-3" />
                                    <Text className="text-white/60 font-black text-xs uppercase tracking-[5px]">
                                        TIEMPO RESTANTE
                                    </Text>
                                </MotiView>
                                <Text className="text-white text-8xl font-black z-10 tracking-tighter shadow-2xl">
                                    {formatTime(timerSeconds)}
                                </Text>

                                <MotiView
                                    animate={{ rotate: '360deg' }}
                                    transition={{ loop: true, duration: 25000, type: 'timing' }}
                                    className="absolute -right-20 -top-20 opacity-10"
                                >
                                    <Sparkles size={300} color="white" />
                                </MotiView>
                            </LinearGradient>
                        </MotiView>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
                        {/* Rules Hint */}
                        <View className="mb-10 bg-gray-50 p-8 rounded-[40px] border border-gray-100 border-b-4">
                            <View className="flex-row items-center mb-4">
                                <View className="w-10 h-10 rounded-2xl bg-primary/10 items-center justify-center mr-3">
                                    <HelpCircle size={20} color={COLORS.primary.DEFAULT} />
                                </View>
                                <Text className="text-gray-900 text-xl font-black tracking-tight">Reglas</Text>
                            </View>
                            <Text className="text-gray-500 font-bold leading-6">
                                Empieza el jugador designado. Luego, en ronda, cada uno dice una palabra relacionada (el <Text className="text-secondary">Infiltrao</Text> debe disimular que sabe la palabra). Al terminar el tiempo, <Text className="text-primary">debatan y voten</Text> para encontrarlo.
                            </Text>
                        </View>

                        {/* Players Peek Section */}
                        <View className="mb-10">
                            <View className="flex-row justify-between items-center mb-6">
                                <Text className="text-2xl font-black text-gray-900 tracking-tight">¿Algún olvidadizo?</Text>
                            </View>

                            <View className="flex-row flex-wrap justify-between">
                                {players.map((player, idx) => (
                                    <TouchableOpacity
                                        key={player.id}
                                        onPress={() => {
                                            haptics.light();
                                            setModalPlayerIndex(idx);
                                            setShowSecretModal(true);
                                        }}
                                        activeOpacity={0.8}
                                        style={{ width: '48%' }}
                                        className="bg-white border border-gray-100 p-6 rounded-[32px] flex-row items-center justify-between mb-4 shadow-sm"
                                    >
                                        <Text className="font-black text-gray-700 text-sm tracking-tight">{player.name}</Text>
                                        <View className="bg-primary/5 p-2 rounded-xl">
                                            <Eye size={18} color={COLORS.primary.DEFAULT} />
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
                    </ScrollView>

                    <MotiView className="pb-10 pt-4">
                        <Button
                            label="IR A VOTACIÓN"
                            variant="secondary"
                            size="xl"
                            onPress={handleVote}
                            icon={<ArrowRight size={24} color="white" />}
                            className="h-20"
                        />
                    </MotiView>
                </View>
            </SafeAreaView>

            {/* Secret Peek Modal */}
            <Modal
                visible={showSecretModal}
                transparent
                animationType="fade"
            >
                <View className="flex-1 bg-black/60 items-center justify-center p-8">
                    <MotiView
                        from={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="w-full bg-white rounded-[56px] p-10 items-center shadow-2xl relative overflow-hidden"
                    >
                        {/* Background Decor */}
                        <MotiView
                            animate={{ rotate: '360deg' }}
                            transition={{ loop: true, duration: 15000, type: 'timing' }}
                            className="absolute -right-20 -bottom-20 opacity-5"
                            pointerEvents="none"
                        >
                            <Sparkles size={250} color={COLORS.primary.DEFAULT} />
                        </MotiView>

                        <MotiView
                            from={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="bg-primary/10 p-8 rounded-full mb-8 z-10"
                        >
                            <AlertCircle size={64} color={COLORS.primary.DEFAULT} />
                        </MotiView>

                        <Text className="text-gray-400 font-black text-xs uppercase tracking-[5px] mb-2 z-10">RECUERDO PARA</Text>
                        <Text className="text-5xl font-black text-gray-900 mb-10 tracking-tighter z-10 text-center">
                            {players[modalPlayerIndex]?.name.toUpperCase()}
                        </Text>

                        <View className="w-full h-[1px] bg-gray-100 mb-10 z-10" />

                        {players[modalPlayerIndex]?.role === "Civil" ? (
                            <View className="bg-primary w-full py-8 px-4 rounded-[32px] shadow-2xl border-b-8 border-primary-dark items-center justify-center">
                                <Text
                                    className="text-5xl font-black text-white tracking-tighter text-center"
                                    adjustsFontSizeToFit
                                    numberOfLines={1}
                                >
                                    {players[modalPlayerIndex]?.secretWord?.toUpperCase()}
                                </Text>
                            </View>
                        ) : (
                            <View className="items-center z-10 w-full">
                                <LinearGradient
                                    colors={GRADIENTS.secondary}
                                    className="w-full py-8 rounded-[32px] items-center justify-center shadow-2xl"
                                >
                                    <Text className="text-white font-black text-4xl tracking-tighter">
                                        ¡SOS EL INFILTRAO!
                                    </Text>
                                    <Text className="text-white/70 mt-2 font-bold text-xs uppercase tracking-widest">MENTÍ PARA GANAR</Text>
                                </LinearGradient>
                            </View>
                        )}

                        <Button
                            label="ENTENDIDO"
                            className="mt-12 w-full h-24 z-50"
                            size="xl"
                            onPress={() => {
                                haptics.light();
                                setShowSecretModal(false);
                            }}
                        />
                    </MotiView>
                </View>
            </Modal>
        </View>
    );
}
