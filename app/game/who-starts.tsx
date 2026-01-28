import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useGameStore } from '../../store/useGameStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut, ZoomIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../components/Button';

export default function WhoStartsScreen() {
    const router = useRouter();
    const startingPlayerName = useGameStore((state) => state.startingPlayerName);
    const finishReveal = useGameStore((state) => state.finishReveal);

    const handleContinue = () => {
        finishReveal(); // Sets phase to 'playing'
        router.replace('/game/round');
    };

    // Optional: Auto-advance after 5 seconds? 
    // User requested "bajarlo de 3 a 2 minutos" for the timer, 
    // and "que muestre una pantallita linda diciendo quien empieza por un ratito" (show a nice screen saying who starts for a little while).
    // "y despues ya que muestre la pantalla del segundero" (and then show the timer screen).
    useEffect(() => {
        const timer = setTimeout(() => {
            handleContinue();
        }, 4000); // 4 seconds

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient
            colors={['#1a1a2e', '#16213e', '#1a1a2e']}
            className="flex-1"
        >
            <SafeAreaView className="flex-1 justify-center items-center px-6">
                <Animated.View
                    entering={FadeIn.duration(500)}
                    className="items-center w-full"
                >
                    <Text className="text-white/60 text-xl font-bold mb-4 tracking-widest text-center uppercase">
                        El debate comienza con
                    </Text>

                    <Animated.View entering={ZoomIn.delay(300).springify()}>
                        <View className="bg-white/10 p-8 rounded-3xl border border-white/20 shadow-lg shadow-black/50 mb-8 backdrop-blur-md">
                            <Text className="text-4xl font-black text-cyan-400 text-center tracking-tighter drop-shadow-md">
                                {startingPlayerName || "Jugador 1"}
                            </Text>
                        </View>
                    </Animated.View>

                    <Text className="text-white/40 text-center mb-12">
                        Preparate para defender tu inocencia...
                    </Text>

                    <Button
                        label="¡A JUGAR!"
                        onPress={handleContinue}
                        variant="primary"
                    />
                </Animated.View>
            </SafeAreaView>
        </LinearGradient>
    );
}
