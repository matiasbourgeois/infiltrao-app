import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, TextInput, KeyboardAvoidingView, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useGameStore } from "../../store/useGameStore";
import { Button } from "../../components/Button";
import { router } from "expo-router";
import { ChevronLeft, Users, UserX, Info, Sparkles, User, PenLine } from "lucide-react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { MotiView, AnimatePresence } from "moti";
import { useHaptics } from "../../hooks/useHaptics";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

export default function GameSetup() {
    const {
        playerCount,
        setPlayerCount,
        impostorCount,
        setImpostorCount,
        startGame,
        currentDeck,
        playerNames,
        setPlayerNames
    } = useGameStore();
    const haptics = useHaptics();

    // Local state to manage names temporarily before syncing with store
    const [localNames, setLocalNames] = useState<string[]>(Array(playerCount).fill(""));

    // Sync local names when playerCount changes
    useEffect(() => {
        setLocalNames(prev => {
            const newNames = [...prev];
            if (playerCount > newNames.length) {
                return [...newNames, ...Array(playerCount - newNames.length).fill("")];
            } else {
                return newNames.slice(0, playerCount);
            }
        });
    }, [playerCount]);

    const handleStart = () => {
        setPlayerNames(localNames);
        startGame();
        haptics.success();
        router.push("/game/role-reveal");
    };

    const handleSetPlayer = (num: number) => {
        setPlayerCount(num);
        haptics.light();
    };

    const handleSetImpostor = (num: number) => {
        setImpostorCount(num);
        haptics.light();
    };

    const updateName = (index: number, text: string) => {
        const newNames = [...localNames];
        newNames[index] = text;
        setLocalNames(newNames);
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    className="flex-1"
                >
                    <View className="flex-1 px-8 pt-6">
                        {/* Header */}
                        <View className="flex-row items-center mb-10">
                            <TouchableOpacity
                                onPress={() => { haptics.light(); router.back(); }}
                                className="w-12 h-12 bg-white rounded-2xl shadow-xl items-center justify-center border border-gray-100"
                            >
                                <ChevronLeft size={24} color={COLORS.gray[900]} />
                            </TouchableOpacity>
                            <View className="ml-6">
                                <Text className="text-4xl font-black text-gray-900 tracking-tighter">Partida</Text>
                                <Text className="text-primary font-bold text-[10px] uppercase tracking-[4px] mt-[-4px]">
                                    CONFIGURACIÓN
                                </Text>
                            </View>
                        </View>

                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            className="flex-1"
                            contentContainerStyle={{ paddingBottom: 150 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {/* Deck Summary Card */}
                            <MotiView
                                from={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="mb-10"
                            >
                                <LinearGradient
                                    colors={GRADIENTS.primary}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    className="p-10 rounded-[48px] shadow-2xl relative overflow-hidden"
                                >
                                    <View className="z-10">
                                        <View className="flex-row items-center mb-4">
                                            <View className="bg-white/20 p-2 rounded-lg mr-3">
                                                <Sparkles size={16} color="white" />
                                            </View>
                                            <Text className="text-white/60 font-black text-[10px] uppercase tracking-[3px]">
                                                MAZO SELECCIONADO
                                            </Text>
                                        </View>
                                        <View className="flex-row items-center">
                                            {(currentDeck?.icon?.startsWith("file://") || currentDeck?.icon?.startsWith("http")) ? (
                                                <Image
                                                    source={{ uri: currentDeck.icon }}
                                                    style={{ width: 48, height: 48, borderRadius: 12, marginRight: 16 }}
                                                    resizeMode="cover"
                                                />
                                            ) : (
                                                <Text className="text-5xl mr-4">{currentDeck?.icon}</Text>
                                            )}
                                            <Text className="text-white text-3xl font-black max-w-[200px]" style={{ lineHeight: 34 }}>
                                                {currentDeck?.name}
                                            </Text>
                                        </View>
                                    </View>
                                    <MotiView
                                        animate={{ rotate: '360deg' }}
                                        transition={{ loop: true, duration: 20000, type: 'timing' }}
                                        className="absolute -right-10 -bottom-10 opacity-10"
                                    >
                                        <Sparkles size={200} color="white" />
                                    </MotiView>
                                </LinearGradient>
                            </MotiView>

                            {/* Player Selection */}
                            <View className="mb-10">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-primary/10 rounded-2xl items-center justify-center mr-4">
                                        <Users size={22} color={COLORS.primary.DEFAULT} />
                                    </View>
                                    <Text className="text-2xl font-black text-gray-900 tracking-tight">¿Cuántos juegan?</Text>
                                </View>

                                <View className="flex-row flex-wrap justify-between">
                                    {[3, 4, 5, 6, 7, 8, 9, 10].map((num, idx) => (
                                        <TouchableOpacity
                                            key={num}
                                            onPress={() => handleSetPlayer(num)}
                                            className={`w-[22%] aspect-square items-center justify-center rounded-3xl mb-4 shadow-sm border ${playerCount === num
                                                ? "bg-primary border-primary"
                                                : "bg-white border-gray-100"
                                                }`}
                                        >
                                            <Text className={`text-2xl font-black ${playerCount === num ? "text-white" : "text-gray-400"}`}>
                                                {num}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Impostor Selection */}
                            <View className="mb-10">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-secondary/10 rounded-2xl items-center justify-center mr-4">
                                        <UserX size={22} color={COLORS.secondary.DEFAULT} />
                                    </View>
                                    <Text className="text-2xl font-black text-gray-900 tracking-tight">¿Cuántos Infiltraos?</Text>
                                </View>

                                <View className="flex-row space-x-4">
                                    {[1, 2].map((num, idx) => (
                                        <TouchableOpacity
                                            key={num}
                                            onPress={() => handleSetImpostor(num)}
                                            className={`flex-1 h-20 items-center justify-center rounded-[32px] border shadow-sm ${impostorCount === num
                                                ? "bg-secondary border-secondary"
                                                : "bg-white border-gray-100"
                                                }`}
                                        >
                                            <Text className={`text-xl font-black uppercase tracking-widest ${impostorCount === num ? "text-white" : "text-gray-400"}`}>
                                                {num} INFILTRAO{num > 1 ? 'S' : ''}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Player Names - NEW SECTION */}
                            <View className="mb-10">
                                <View className="flex-row items-center mb-6">
                                    <View className="w-12 h-12 bg-gray-100 rounded-2xl items-center justify-center mr-4">
                                        <PenLine size={22} color={COLORS.gray[700]} />
                                    </View>
                                    <Text className="text-2xl font-black text-gray-900 tracking-tight">Nombres</Text>
                                </View>

                                <View className="bg-gray-50 p-6 rounded-[40px] border border-gray-100">
                                    <AnimatePresence>
                                        {localNames.map((name, index) => (
                                            <MotiView
                                                key={index}
                                                from={{ opacity: 0, translateX: -10 }}
                                                animate={{ opacity: 1, translateX: 0 }}
                                                transition={{ delay: index * 50 }}
                                                className="flex-row items-center mb-4 bg-white rounded-2xl p-3 border border-gray-100 shadow-sm"
                                            >
                                                <View className="w-10 h-10 bg-gray-50 rounded-xl items-center justify-center mr-4">
                                                    <Text className="text-gray-400 font-black">{index + 1}</Text>
                                                </View>
                                                <TextInput
                                                    className="flex-1 text-lg font-bold text-gray-800"
                                                    placeholder={`Jugador ${index + 1}`}
                                                    placeholderTextColor="#CBD5E1"
                                                    value={name}
                                                    onChangeText={(text) => updateName(index, text)}
                                                />
                                                <User size={18} color={COLORS.gray[300]} className="ml-2" />
                                            </MotiView>
                                        ))}
                                    </AnimatePresence>
                                </View>
                            </View>

                            <View className="flex-row items-center bg-gray-50 p-6 rounded-[32px] mb-10 border border-gray-100">
                                <Info size={20} color={COLORS.gray[400]} className="mr-4" />
                                <Text className="text-gray-500 font-medium text-xs leading-5 flex-1">
                                    Personalizá los nombres para una experiencia más divertida.
                                </Text>
                            </View>
                        </ScrollView>

                        <MotiView
                            from={{ opacity: 0, translateY: 50 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="pb-10 pt-4"
                        >
                            <Button
                                label="REPARTIR ROLES"
                                size="xl"
                                onPress={handleStart}
                                className="h-20"
                            />
                        </MotiView>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </View>
    );
}
