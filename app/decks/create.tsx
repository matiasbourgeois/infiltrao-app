import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDeckStore } from "../../store/useDeckStore";
import { router } from "expo-router";
import { ChevronLeft, Plus, Trash2, Save, Sparkles, Wand2, Info, Image as ImageIcon } from "lucide-react-native";
import * as ImagePicker from 'expo-image-picker';
import { Image } from "react-native";
import { COLORS, GRADIENTS } from "../../constants/theme";
import { Button } from "../../components/Button";
import { MotiView } from "moti";
import { useHaptics } from "../../hooks/useHaptics";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateDeck() {
    const [name, setName] = useState("");
    const [icon, setIcon] = useState("✨");
    const [words, setWords] = useState(["", "", "", "", ""]);
    const { addDeck } = useDeckStore();
    const haptics = useHaptics();

    const pickImage = async () => {
        haptics.light();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            setIcon(result.assets[0].uri);
        }
    };

    const handleAddWord = () => {
        haptics.light();
        setWords([...words, ""]);
    };

    const handleWordChange = (text: string, index: number) => {
        const newWords = [...words];
        newWords[index] = text;
        setWords(newWords);
    };

    const handleRemoveWord = (index: number) => {
        haptics.medium();
        const newWords = words.filter((_, i) => i !== index);
        setWords(newWords);
    };

    const handleSave = () => {
        if (!name || words.filter(w => w.trim()).length < 5) {
            haptics.error();
            return;
        }

        addDeck({
            id: Date.now().toString(),
            name,
            icon,
            difficulty: "Medio",
            words: words.filter(w => w.trim()),
            isCustom: true,
        });

        haptics.success();
        router.back();
    };

    return (
        <View className="flex-1 bg-white">
            <LinearGradient colors={['#FDFCFE', '#FFFFFF']} className="absolute inset-0" />

            <SafeAreaView className="flex-1">
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
                            <Text className="text-4xl font-black text-gray-900 tracking-tighter">Creador</Text>
                            <Text className="text-primary font-bold text-[10px] uppercase tracking-[4px] mt-[-4px]">
                                DISEÑÁ TU MAZO
                            </Text>
                        </View>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} className="flex-1" contentContainerStyle={{ paddingBottom: 40 }}>
                        {/* Name & Icon Input */}
                        <MotiView
                            from={{ opacity: 0, translateY: 20 }}
                            animate={{ opacity: 1, translateY: 0 }}
                            className="bg-gray-50 p-8 rounded-[48px] border border-gray-100 mb-8"
                        >
                            <View className="flex-row items-center mb-8">
                                <TouchableOpacity
                                    className="w-24 h-24 bg-white rounded-3xl shadow-sm items-center justify-center border border-gray-100 mr-6 overflow-hidden"
                                    onPress={pickImage}
                                >
                                    {(icon.startsWith("file://") || icon.startsWith("http")) ? (
                                        <Image source={{ uri: icon }} className="w-full h-full" resizeMode="cover" />
                                    ) : (
                                        <Text className="text-4xl">{icon}</Text>
                                    )}
                                    <View className="absolute -bottom-2 -right-2 bg-primary rounded-full p-2 border-2 border-white">
                                        <ImageIcon size={14} color="white" />
                                    </View>
                                </TouchableOpacity>
                                <View className="flex-1">
                                    <Text className="text-gray-400 font-black text-[10px] uppercase tracking-widest mb-2">NOMBRE DEL MAZO</Text>
                                    <TextInput
                                        className="text-2xl font-black text-gray-900 border-b-2 border-primary/20 pb-2"
                                        placeholder="Ej: Previa en lo de Juan"
                                        placeholderTextColor="#CBD5E1"
                                        value={name}
                                        onChangeText={setName}
                                    />
                                </View>
                            </View>

                            <View className="bg-white p-6 rounded-[32px] border border-gray-100">
                                <View className="flex-row items-center mb-2">
                                    <Sparkles size={16} color={COLORS.primary.DEFAULT} className="mr-2" />
                                    <Text className="text-gray-900 font-black text-xs uppercase tracking-widest">Maestro Tip</Text>
                                </View>
                                <Text className="text-gray-400 font-medium text-xs leading-5">
                                    Usá palabras que sean comunes pero no obvias para que el Sota tenga chances.
                                </Text>
                            </View>
                        </MotiView>

                        {/* Words List */}
                        <View className="mb-6 px-2 flex-row justify-between items-center">
                            <Text className="text-gray-400 font-black text-xs uppercase tracking-[4px]">PALABRAS SECRETAS</Text>
                            <Badge label={`${words.filter(w => w.trim()).length} Agregadas`} variant="primary" />
                        </View>

                        {words.map((word, index) => (
                            <MotiView
                                key={index}
                                from={{ opacity: 0, translateX: -10 }}
                                animate={{ opacity: 1, translateX: 0 }}
                                transition={{ delay: index * 50 }}
                                className="flex-row items-center mb-3 group"
                            >
                                <View className="flex-1 bg-white border border-gray-100 rounded-[28px] p-2 pr-4 shadow-sm flex-row items-center">
                                    <View className="w-12 h-12 bg-gray-50 rounded-2xl items-center justify-center mr-4">
                                        <Text className="text-gray-400 font-black">{index + 1}</Text>
                                    </View>
                                    <TextInput
                                        className="flex-1 text-lg font-bold text-gray-900 py-2"
                                        placeholder="Escribí una palabra..."
                                        placeholderTextColor="#E2E8F0"
                                        value={word}
                                        onChangeText={(text) => handleWordChange(text, index)}
                                        multiline={false}
                                    />
                                    {words.length > 3 && (
                                        <TouchableOpacity onPress={() => handleRemoveWord(index)} className="p-2 bg-red-50 rounded-xl">
                                            <Trash2 size={16} color="#EF4444" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </MotiView>
                        ))}

                        <TouchableOpacity
                            onPress={handleAddWord}
                            className="flex-row items-center justify-center py-6 mt-4 border-2 border-dashed border-gray-200 rounded-[32px] bg-gray-50/50"
                        >
                            <Plus size={20} color={COLORS.gray[400]} className="mr-2" />
                            <Text className="text-gray-400 font-black uppercase tracking-widest text-xs">AGREGAR PALABRA</Text>
                        </TouchableOpacity>
                    </ScrollView>

                    <MotiView className="pb-10 pt-4">
                        <Button
                            label={words.filter(w => w.trim()).length < 5 ? `AGREGÁ ${5 - words.filter(w => w.trim()).length} MÁS` : "GUARDAR MAZO"}
                            size="xl"
                            onPress={handleSave}
                            disabled={!name || words.filter(w => w.trim()).length < 5}
                            icon={words.filter(w => w.trim()).length >= 5 ? <Save size={24} color="white" /> : undefined}
                            className="h-20"
                        />
                    </MotiView>
                </View>
            </SafeAreaView>
        </View>
    );
}

const Badge = ({ label, variant }: { label: string, variant: string }) => (
    <View className="bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        <Text className="text-primary font-black text-[9px] uppercase tracking-widest">{label}</Text>
    </View>
);
