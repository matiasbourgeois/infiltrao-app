export type Difficulty = "Fácil" | "Medio" | "Difícil" | "Easy" | "Medium" | "Hard";

export interface Deck {
    id: string;
    name: string;
    icon: string;
    difficulty: Difficulty;
    words: string[];
    isCustom?: boolean;
}

export type PlayerRoleString = "Civil" | "Impostor";

export interface Player {
    id: number;
    name: string;
    role: PlayerRoleString;
    secretWord: string | null;
}

export interface GameState {
    currentDeck: Deck | null;
    playerCount: number;
    impostorCount: number;
    players: Player[];
    playerNames: string[];
    gamePhase: "config" | "reveal" | "playing" | "voting" | "result";
    currentPlayerIndex: number;
    timerSeconds: number;
    winner: "Civiles" | "Impostor" | null;
}
