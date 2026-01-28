import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Badge } from "./Badge";
import { LinearGradient } from "expo-linear-gradient";
import { GRADIENTS, COLORS } from "../constants/theme";
import { MotiView } from "moti";
import { useHaptics } from "../hooks/useHaptics";
import { PlusCircle, Sparkles, Flame, Trophy, Info } from "lucide-react-native";
import { Deck } from "../types/game";

interface DeckCardProps {
    deck: Deck | null;
    isPlaceholder?: boolean;
    onPress: () => void;
    isSelected?: boolean;
    variant?: 'carousel' | 'list';
}

export const DeckCard: React.FC<DeckCardProps> = ({
    deck,
    isPlaceholder,
    onPress,
    isSelected,
    variant = 'carousel'
}) => {
    const haptics = useHaptics();
    const isList = variant === 'list';

    const handlePress = () => {
        haptics.medium();
        onPress();
    };

    const getDifficultyLabel = (diff: string) => {
        if (diff === 'Fácil') return 'FÁCIL';
        if (diff === 'Medio') return 'MEDIO';
        return 'DIFÍCIL';
    };

    if (isPlaceholder) {
        if (isList) {
            return (
                <MotiView animate={{ scale: 1 }} className="w-full">
                    <TouchableOpacity
                        onPress={handlePress}
                        activeOpacity={0.8}
                        className="w-full h-24 bg-primary/5 rounded-[24px] border-2 border-dashed border-primary/30 flex-row items-center justify-center"
                    >
                        <PlusCircle size={32} color={COLORS.primary.DEFAULT} opacity={0.6} className="mr-3" />
                        <Text className="text-primary font-black text-lg tracking-widest uppercase">CREAR MAZO</Text>
                    </TouchableOpacity>
                </MotiView>
            );
        }
        // Carousel Placeholder
        return (
            <TouchableOpacity onPress={handlePress} activeOpacity={0.8} className="w-full h-96">
                <View className="flex-1 border-dashed border-2 border-primary/30 items-center justify-center bg-primary/5 rounded-[48px]">
                    <MotiView
                        animate={{ scale: [1, 1.1, 1], rotate: ['0deg', '5deg', '-5deg', '0deg'] }}
                        transition={{ loop: true, duration: 3000, type: 'timing' }}
                    >
                        <PlusCircle size={64} color={COLORS.primary.DEFAULT} opacity={0.6} />
                    </MotiView>
                    <Text className="text-primary font-black mt-6 text-xl tracking-widest">CREAR MAZO</Text>
                </View>
            </TouchableOpacity>
        );
    }

    if (!deck) return null;

    // --- LIST VARIANT (Horizontal Button) ---
    if (isList) {
        return (
            <MotiView
                animate={{ scale: isSelected ? 1 : 0.98, opacity: 1 }}
                transition={{ type: "spring", damping: 20 }}
                className="w-full h-24"
            >
                <TouchableOpacity
                    onPress={handlePress}
                    activeOpacity={0.9}
                    className="flex-1"
                    style={styles.cardContainer}
                >
                    <LinearGradient
                        colors={isSelected ? GRADIENTS.primary : ['#FFFFFF', '#F8FAFC'] as const}
                        start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                        className="flex-1 rounded-[24px] flex-row items-center px-5 relative overflow-hidden border border-white/50"
                    >
                        {isSelected && (
                            <View style={StyleSheet.absoluteFillObject}>
                                <LinearGradient colors={['rgba(255,255,255,0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 0, y: 1 }} className="flex-1" />
                            </View>
                        )}

                        <View className={`w-14 h-14 rounded-2xl ${isSelected ? "bg-white/20" : "bg-primary/5"} items-center justify-center mr-4 backdrop-blur-sm`}>
                            {(deck.icon.startsWith("file://") || deck.icon.startsWith("http")) ? (
                                <Image source={{ uri: deck.icon }} style={{ width: 40, height: 40, borderRadius: 10 }} resizeMode="cover" />
                            ) : (
                                <Text style={{ fontSize: 32 }}>{deck.icon}</Text>
                            )}
                        </View>

                        <View className="flex-1 justify-center z-10">
                            <View className="flex-row items-center mb-0.5">
                                {isSelected && <Sparkles size={12} color="white" className="mr-1" />}
                                <Text className={`font-black tracking-[3px] text-[9px] uppercase ${isSelected ? "text-white/70" : "text-primary/60"}`}>
                                    {deck.id === "deck_mix" ? "30" : deck.words.length} PALABRAS
                                </Text>
                            </View>
                            <Text
                                className={`font-black uppercase tracking-tight leading-7 ${isSelected ? "text-white" : "text-gray-900"}`}
                                style={{ fontSize: 22 }}
                                numberOfLines={1}
                                adjustsFontSizeToFit
                            >
                                {deck.name}
                            </Text>
                        </View>

                        <View className="ml-2 items-end z-10">
                            <Badge
                                label={getDifficultyLabel(deck.difficulty)}
                                variant={isSelected ? "primary" : "info"}
                                size="sm"
                                className={isSelected ? "bg-white/20" : ""}
                            />
                        </View>
                    </LinearGradient>
                </TouchableOpacity>
            </MotiView>
        );
    }

    // --- CAROUSEL VARIANT (Large Vertical Card) ---
    return (
        <MotiView
            animate={{ scale: isSelected ? 1 : 0.95, opacity: isSelected ? 1 : 0.7 }}
            transition={{ type: "spring", damping: 20, stiffness: 150 }}
            className="w-full h-96"
        >
            <TouchableOpacity
                onPress={handlePress}
                activeOpacity={0.9}
                className="flex-1"
                style={styles.cardContainer}
            >
                <LinearGradient
                    colors={isSelected ? GRADIENTS.primary : ['#FFFFFF', '#F8FAFC'] as const}
                    start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
                    className="flex-1 p-8 rounded-[48px] justify-between relative overflow-hidden"
                >
                    {isSelected && (
                        <View style={StyleSheet.absoluteFillObject}>
                            <LinearGradient colors={['rgba(255,255,255,0.2)', 'transparent']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} className="flex-1" />
                        </View>
                    )}

                    <View className="flex-row justify-between items-start z-10">
                        <View className={`rounded-[24px] ${isSelected ? "bg-white/20" : "bg-primary/5"} backdrop-blur-md overflow-hidden p-4`}>
                            {(deck.icon.startsWith("file://") || deck.icon.startsWith("http")) ? (
                                <Image source={{ uri: deck.icon }} style={{ width: 64, height: 64 }} resizeMode="cover" />
                            ) : (
                                <Text style={{ fontSize: 64 }}>{deck.icon}</Text>
                            )}
                        </View>
                        <Badge
                            label={getDifficultyLabel(deck.difficulty)}
                            variant={isSelected ? "primary" : "info"}
                            className={isSelected ? "bg-white/30" : ""}
                        />
                    </View>

                    <View className="z-10">
                        <View className="flex-row items-center mb-2">
                            {isSelected && <Sparkles size={16} color="white" className="mr-2" />}
                            <Text className={`font-black tracking-[3px] text-[10px] uppercase ${isSelected ? "text-white/60" : "text-primary/60"}`}>
                                CATEGORÍA
                            </Text>
                        </View>
                        <Text
                            className={`text-5xl font-black mb-2 ${isSelected ? "text-white" : "text-gray-900"}`}
                            style={{ lineHeight: 50, textShadowColor: isSelected ? 'rgba(0,0,0,0.1)' : 'transparent', textShadowRadius: 10, textShadowOffset: { width: 0, height: 2 } }}
                        >
                            {deck.name}
                        </Text>
                        <View className="flex-row items-center bg-black/5 self-start px-4 py-2 rounded-full">
                            <Text className={`font-bold mr-2 text-xs ${isSelected ? "text-white" : "text-primary"}`}>
                                {deck.id === "deck_mix" ? "30" : deck.words.length} PALABRAS
                            </Text>
                            <Info size={12} color={isSelected ? "white" : COLORS.primary.DEFAULT} opacity={0.5} />
                        </View>
                    </View>

                    <MotiView
                        animate={{ rotate: '360deg' }}
                        transition={{ loop: true, duration: 15000, type: 'timing' }}
                        className="absolute -bottom-20 -right-20 opacity-10"
                    >
                        <Sparkles size={200} color={isSelected ? "white" : COLORS.primary.DEFAULT} />
                    </MotiView>
                </LinearGradient>
            </TouchableOpacity>
        </MotiView>
    );
};

const styles = StyleSheet.create({
    cardContainer: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.15,
        shadowRadius: 30,
        elevation: 15,
    }
});
