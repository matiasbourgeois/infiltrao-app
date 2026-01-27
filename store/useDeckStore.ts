import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Deck } from "../types/game";
import { INITIAL_DECKS } from "../data/decks";

interface DeckStore {
    customDecks: Deck[];
    allDecks: () => Deck[];
    addDeck: (deck: Deck) => void;
    updateDeck: (deck: Deck) => void;
    deleteDeck: (id: string) => void;
    isPremium: boolean;
    setPremium: (status: boolean) => void;
}

export const useDeckStore = create<DeckStore>()(
    persist(
        (set, get) => ({
            customDecks: [],
            isPremium: false,

            allDecks: () => {
                return [...INITIAL_DECKS, ...get().customDecks];
            },

            addDeck: (deck) =>
                set((state) => ({
                    customDecks: [...state.customDecks, { ...deck, isCustom: true }],
                })),

            updateDeck: (updatedDeck) =>
                set((state) => ({
                    customDecks: state.customDecks.map((d) =>
                        d.id === updatedDeck.id ? updatedDeck : d
                    ),
                })),

            deleteDeck: (id) =>
                set((state) => ({
                    customDecks: state.customDecks.filter((d) => d.id !== id),
                })),

            setPremium: (status) => set({ isPremium: status }),
        }),
        {
            name: "deck-storage",
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
