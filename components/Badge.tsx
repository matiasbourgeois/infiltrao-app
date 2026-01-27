import React from "react";
import { View, Text } from "react-native";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface BadgeProps {
    label: string;
    variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "info";
    size?: "sm" | "md";
    className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
    label,
    variant = "primary",
    size = "md",
    className
}) => {
    const variants = {
        info: "bg-blue-50 text-blue-600 border border-blue-100",
        success: "bg-green-50 text-green-600 border border-green-100",
        warning: "bg-yellow-50 text-yellow-600 border border-yellow-100",
        danger: "bg-red-50 text-red-600 border border-red-100",
        primary: "bg-primary/10 text-primary border border-primary/20",
        secondary: "bg-secondary/10 text-secondary border border-secondary/20",
    };

    const isSmall = size === "sm";
    const paddingClass = isSmall ? "px-2 py-0.5" : "px-4 py-1.5";
    const textSizeClass = isSmall ? "text-[8px]" : "text-[10px]";

    return (
        <View className={cn(`${paddingClass} rounded-full`, variants[variant], className)}>
            <Text className={cn(`${textSizeClass} font-black uppercase tracking-widest`, variant === "primary" ? "text-primary" : "")}>
                {label}
            </Text>
        </View>
    );
};
