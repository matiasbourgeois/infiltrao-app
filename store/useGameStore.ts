import { create } from "zustand";
import { GameState, Deck, Player, PlayerRoleString } from "../types/game";

interface GameStore extends GameState {
    setDeck: (deck: Deck) => void;
    setPlayerCount: (count: number) => void;
    setImpostorCount: (count: number) => void;
    setPlayerNames: (names: string[]) => void;
    startGame: () => void;
    nextPlayer: () => void;
    finishReveal: () => void;
    setWinner: (winner: "Civiles" | "Impostor") => void;
    resetGame: () => void;
    decrementTimer: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
    currentDeck: null,
    playerCount: 3,
    impostorCount: 1,
    players: [],
    playerNames: [],
    gamePhase: "config",
    currentPlayerIndex: 0,
    timerSeconds: 180, // 3 minutes default
    winner: null,

    setDeck: (deck: Deck) => set({ currentDeck: deck }),
    setPlayerCount: (count: number) => set({ playerCount: count }),
    setImpostorCount: (count: number) => set({ impostorCount: count }),
    setPlayerNames: (names: string[]) => set({ playerNames: names }),

    startGame: () => {
        const { currentDeck, playerCount, impostorCount, playerNames } = get();
        if (!currentDeck) return;

        // Create initial roles pool
        // Handle MIX DECK logic
        let deckToPlay = currentDeck;

        if (currentDeck.id === "deck_mix") {
            // We need to import INITIAL_DECKS here to avoid circular dependency issues if possible, 
            // or better, rely on the fact that we can access them if they were part of the state. 
            // Since INITIAL_DECKS is a constant, we can import it.
            // BUT, `useGameStore` is in `store/`, `INITIAL_DECKS` in `data/`.
            const { INITIAL_DECKS } = require("../data/decks");

            // Access custom decks from the separate store
            // We use require to avoid circular dependency if useDeckStore imports useGameStore, etc.
            // But stores usually don't depend on each other cyclically. 
            const { useDeckStore } = require("./useDeckStore");
            const { customDecks } = useDeckStore.getState();

            // Aggregate all words
            let allWords: string[] = [];
            INITIAL_DECKS.forEach((d: Deck) => {
                if (d.id !== "deck_mix") allWords = [...allWords, ...d.words];
            });

            // Add words from custom decks!
            if (customDecks && customDecks.length > 0) {
                customDecks.forEach((d: Deck) => {
                    allWords = [...allWords, ...d.words];
                });
            }

            // Shuffle all words
            for (let i = allWords.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allWords[i], allWords[j]] = [allWords[j], allWords[i]];
            }

            // Pick 10
            const mixedWords = allWords.slice(0, 10);

            // Create a temporary deck object for this game
            deckToPlay = { ...currentDeck, words: mixedWords };
        }

        const secretWord =
            deckToPlay.words[Math.floor(Math.random() * deckToPlay.words.length)];

        // Create initial roles pool
        const roles: PlayerRoleString[] = [];
        for (let i = 0; i < playerCount; i++) {
            roles.push(i < impostorCount ? "Impostor" : "Civil");
        }

        // Fisher-Yates Shuffle for absolute randomness
        for (let i = roles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = roles[i];
            roles[i] = roles[j];
            roles[j] = temp;
        }

        const players: Player[] = roles.map((role, index) => ({
            id: index,
            name: playerNames[index]?.trim() || `Jugador ${index + 1}`,
            role,
            secretWord: role === "Civil" ? secretWord : null,
        }));

        set({
            players,
            gamePhase: "reveal",
            currentPlayerIndex: 0,
            winner: null,
            timerSeconds: 180,
        });
    },

    nextPlayer: () => {
        const { currentPlayerIndex, playerCount } = get();
        if (currentPlayerIndex < playerCount - 1) {
            set({ currentPlayerIndex: currentPlayerIndex + 1 });
        } else {
            set({ gamePhase: "playing" });
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

    setWinner: (winner: "Civiles" | "Impostor") => set({ winner, gamePhase: "result" }),

    resetGame: () =>
        set({
            gamePhase: "config",
            players: [],
            currentPlayerIndex: 0,
            winner: null,
            playerNames: [],
        }),
}));
