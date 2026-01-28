import { create } from "zustand";
import { Deck, Player, PlayerRoleString } from "../types/game";
import { INITIAL_DECKS } from "../data/decks";

interface GameState {
    currentDeck: Deck | null;
    playerCount: number;
    impostorCount: number;
    players: Player[];
    playerNames: string[];
    gamePhase: "config" | "reveal" | "playing" | "result";
    currentPlayerIndex: number;
    timerSeconds: number;
    timerDuration: number;
    winner: "Civiles" | "Impostor" | null;
    startingPlayerName: string | null;

    setDeck: (deck: Deck) => void;
    setPlayerCount: (count: number) => void;
    setImpostorCount: (count: number) => void;
    setPlayerNames: (names: string[]) => void;
    setTimerDuration: (duration: number) => void;

    startGame: (customDecks?: Deck[]) => void;
    nextPlayer: () => void;
    finishReveal: () => void;
    decrementTimer: () => void;
    setWinner: (winner: "Civiles" | "Impostor") => void;
    resetGame: () => void;
}

export const useGameStore = create<GameState>((set, get) => ({
    currentDeck: null,
    playerCount: 3,
    impostorCount: 1,
    players: [],
    playerNames: [],
    gamePhase: "config",
    currentPlayerIndex: 0,
    timerSeconds: 120, // Default to 2 minutes now
    timerDuration: 120, // Default to 2 minutes now
    winner: null,
    startingPlayerName: null,

    setDeck: (deck: Deck) => set({ currentDeck: deck }),
    setPlayerCount: (count: number) => set({ playerCount: count }),
    setImpostorCount: (count: number) => set({ impostorCount: count }),
    setPlayerNames: (names: string[]) => set({ playerNames: names }),
    setTimerDuration: (duration: number) => set({ timerDuration: duration, timerSeconds: duration }),

    startGame: (customDecks) => {
        const { currentDeck, playerCount, impostorCount, playerNames, timerDuration } = get();
        if (!currentDeck) return;

        // --- WORD SELECTION LOGIC ---
        let allWords: string[] = [];

        if (currentDeck.id === "deck_mix") {
            // Add words from initial decks (excluding the mix deck itself if it were in there)
            INITIAL_DECKS.forEach((d) => {
                if (d.id !== "deck_mix") allWords.push(...d.words);
            });
            // Add words from custom decks
            if (customDecks) {
                customDecks.forEach((d) => allWords.push(...d.words));
            }
        } else {
            allWords = [...currentDeck.words];
        }

        // Shuffle words pool
        for (let i = allWords.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
        }

        // Limit to 30 words if it's the mix deck
        const finalWordsPool = currentDeck.id === "deck_mix" ? allWords.slice(0, 30) : allWords;
        const secretWord = finalWordsPool[Math.floor(Math.random() * finalWordsPool.length)];

        // --- ROLE ASSIGNMENT LOGIC (Fisher-Yates) ---
        const roles: PlayerRoleString[] = [];
        // Fill roles array
        for (let i = 0; i < playerCount; i++) {
            roles.push(i < impostorCount ? "Impostor" : "Civil");
        }

        // Shuffle roles array
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [roles[i], roles[j]] = [roles[j], roles[i]];
        }

        const players: Player[] = roles.map((role, index) => ({
            id: index,
            name: playerNames[index]?.trim() || `Jugador ${index + 1}`,
            role,
            secretWord: role === "Civil" ? secretWord : null,
        }));

        // --- STARTING PLAYER LOGIC ---
        // Pick a completely random player index to start
        const startingIndex = Math.floor(Math.random() * players.length);
        const startingPlayerName = players[startingIndex].name;

        set({
            players,
            gamePhase: "reveal",
            currentPlayerIndex: 0,
            winner: null,
            timerSeconds: timerDuration,
            startingPlayerName,
        });
    },

    nextPlayer: () => {
        const { currentPlayerIndex, playerCount } = get();
        if (currentPlayerIndex < playerCount - 1) {
            set({ currentPlayerIndex: currentPlayerIndex + 1 });
        } else {
            // Instead of going straight to playing, we rely on the UI to check gamePhase
            // But actually, 'finishReveal' sets it to 'playing'.
            // nextPlayer just moves the index forward during the reveal phase.
            // When index reaches end, we stay on reveal until 'finishReveal' is called?
            // No, the original logic was:
            // render RoleReveal for index. On 'next', increment index.
            // If index was last, set gamePhase = playing.

            // Wait, we need to show the "Who Starts" screen.
            // So we shouldn't set "playing" yet.
            // We can add a new phase "who_starts"? Or just handle it in the UI.
            // Let's keep data simple. We'll verify this flow.
        }
    },

    finishReveal: () => {
        set({ gamePhase: "playing" });
    },

    decrementTimer: () => {
        set((state) => ({
            timerSeconds: state.timerSeconds > 0 ? state.timerSeconds - 1 : 0,
        }));
    },

    setWinner: (winner) => set({ winner, gamePhase: "result" }),

    resetGame: () =>
        set((state) => ({
            gamePhase: "config",
            players: [],
            currentPlayerIndex: 0,
            winner: null,
            playerNames: state.playerNames, // Keep names
            startingPlayerName: null,
            timerSeconds: state.timerDuration,
        })),
}));
