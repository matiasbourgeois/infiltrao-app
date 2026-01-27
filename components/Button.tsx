import React from "react";
import { Text, View, ActivityIndicator, Pressable, Platform } from "react-native";
import { MotiView } from "moti";
import { LinearGradient } from "expo-linear-gradient";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useHaptics } from "../hooks/useHaptics";
import { GRADIENTS } from "../constants/theme";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps {
    label: string;
    onPress: () => void;
    variant?: "primary" | "secondary" | "outline" | "danger" | "ghost" | "accent";
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    labelClassName?: string;
    isLoading?: boolean;
    disabled?: boolean;
    icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    label,
    onPress,
    variant = "primary",
    size = "md",
    className,
    labelClassName,
    isLoading,
    disabled,
    icon,
}) => {
    const haptics = useHaptics();

    const variants = {
        primary: GRADIENTS.primary,
        secondary: GRADIENTS.secondary,
        accent: GRADIENTS.accent,
        danger: ["#EF4444", "#B91C1C"],
        outline: ["transparent", "transparent"],
        ghost: ["transparent", "transparent"],
    };

    const sizes = {
        sm: "px-4 py-2",
        md: "px-6 py-3",
        lg: "px-8 py-4",
        xl: "px-10 py-5",
    };

    const textSizes = {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
        xl: "text-xl",
    };

    const handlePress = () => {
        haptics.light();
        onPress();
    };

    return (
        <MotiView
            from={{ scale: 1 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 15 }}
        >
            <Pressable
                onPress={handlePress}
                disabled={disabled || isLoading}
                style={({ pressed }) => [
                    {
                        transform: [{ scale: pressed ? 0.96 : 1 }],
                        opacity: disabled || isLoading ? 0.5 : 1,
                    }
                ]}
            >
                <View className={cn("overflow-hidden rounded-2xl shadow-premium", className)}>
                    <LinearGradient
                        colors={variants[variant as keyof typeof variants] as string[]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className={cn(
                            "flex-row items-center justify-center",
                            sizes[size],
                            variant === "outline" && "border-2 border-primary",
                            variant === "ghost" && "border-0 shadow-none"
                        )}
                    >
                        {isLoading ? (
                            <ActivityIndicator color={variant === "outline" ? "#7C3AED" : "white"} />
                        ) : (
                            <View className="flex-row items-center">
                                {icon && <View className="mr-2">{icon}</View>}
                                <Text
                                    className={cn(
                                        "font-black text-center tracking-tight",
                                        textSizes[size],
                                        variant === "outline" || variant === "ghost" ? "text-primary" : "text-white",
                                        labelClassName
                                    )}
                                    style={{
                                        textShadowColor: 'rgba(0, 0, 0, 0.1)',
                                        textShadowOffset: { width: 0, height: 1 },
                                        textShadowRadius: 2,
                                    }}
                                >
                                    {label.toUpperCase()}
                                </Text>
                            </View>
                        )}
                    </LinearGradient>
                </View>
            </Pressable>
        </MotiView>
    );
};
