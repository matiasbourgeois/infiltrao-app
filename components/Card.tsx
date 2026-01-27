import React from "react";
import { View, ViewProps, Platform } from "react-native";
import { MotiView } from "moti";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface CardProps extends ViewProps {
    children: React.ReactNode;
    className?: string;
    animate?: boolean;
    delay?: number;
}

export const Card: React.FC<CardProps> = ({
    children,
    className,
    animate = true,
    delay = 0,
    ...props
}) => {
    const content = (
        <View
            className={cn(
                "bg-white rounded-[32px] p-6 shadow-premium border border-white/20",
                className
            )}
            style={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                ...Platform.select({
                    android: { elevation: 8 },
                    ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 10 }
                })
            }}
            {...props}
        >
            {children}
        </View>
    );

    if (!animate) return content;

    return (
        <MotiView
            from={{ opacity: 0, scale: 0.9, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay
            }}
            className="w-full"
        >
            {content}
        </MotiView>
    );
};
