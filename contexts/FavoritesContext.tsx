"use client";

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

interface FavoritesContextType {
    favorites: Set<string>;
    toggleFavorite: (carId: string) => void;
    isFavorite: (carId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'car-favorites';

export function FavoritesProvider({ children }: PropsWithChildren) {
    const [favorites, setFavorites] = useState<Set<string>>(new Set());

    // Load favorites from localStorage on mount
    useEffect(() => {
        try {
            const savedFavorites = localStorage.getItem(STORAGE_KEY);
            if (savedFavorites) {
                const parsed = JSON.parse(savedFavorites);
                setFavorites(new Set(parsed));
            }
        } catch (error) {
            console.error('Error loading favorites from localStorage:', error);
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(favorites)));
        } catch (error) {
            console.error('Error saving favorites to localStorage:', error);
        }
    }, [favorites]);

    const toggleFavorite = (carId: string) => {
        setFavorites((prev) => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(carId)) {
                newFavorites.delete(carId);
            } else {
                newFavorites.add(carId);
            }
            return newFavorites;
        });
    };

    const isFavorite = (carId: string) => {
        return favorites.has(carId);
    };

    return (
        <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const context = useContext(FavoritesContext);
    if (context === undefined) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
}

