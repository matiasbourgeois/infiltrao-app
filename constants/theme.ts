export const COLORS = {
    primary: {
        DEFAULT: "#7C3AED",
        gradient: ["#7C3AED", "#6366F1"], // Violet to Indigo
        light: "#DDD6FE",
        dark: "#5B21B6",
    },
    secondary: {
        DEFAULT: "#FBBF24",
        gradient: ["#FBBF24", "#F59E0B"], // Yellow to Amber
        light: "#FEF3C7",
        dark: "#B45309",
    },
    accent: {
        DEFAULT: "#EC4899",
        gradient: ["#EC4899", "#DB2777"], // Pink to Rose
        light: "#FCE7F3",
    },
    background: {
        base: "#FDFCFE", // Very light off-white
        pearl: "#F5F3FF", // Light violet tint
    },
    white: "#FFFFFF",
    black: "#0F172A", // Deep slate
    gray: {
        50: "#F8FAFC",
        100: "#F1F5F9",
        200: "#E2E8F0",
        300: "#CBD5E1",
        400: "#94A3B8",
        500: "#64748B",
        600: "#475569",
        700: "#334155",
        800: "#1E293B",
        900: "#0F172A",
    },
    success: "#10B981",
    error: "#EF4444",
};

export const GRADIENTS = {
    primary: ["#7C3AED", "#6366F1"] as const,
    secondary: ["#FBBF24", "#F59E0B"] as const,
    accent: ["#EC4899", "#DB2777"] as const,
    glass: ["rgba(255, 255, 255, 0.8)", "rgba(255, 255, 255, 0.4)"] as const,
    dark: ["rgba(15, 23, 42, 0.8)", "rgba(15, 23, 42, 0.6)"] as const,
};

export const SHADOWS = {
    soft: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    premium: {
        shadowColor: "#7C3AED",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 10,
    },
};
