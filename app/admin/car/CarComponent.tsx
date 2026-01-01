"use client";
import { OverviewStatCard, PageHeader } from '@/components/common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Car,
    CarFront,
    Clock3,
} from 'lucide-react';
import { sampleCars } from './data';
import { useFavorites } from '@/contexts/FavoritesContext';
import CarCard from '@/components/car/CarCard';

const carsOverviewCardConfig = [
    {
        label: "Total cars",
        icon: Car,
        background: "linear-gradient(135deg, #4b6bfb 0%, #3b82f6 100%)",
        accentCircleColor: "rgba(255,255,255,0.4)",
        valueClassName: "text-lg sm:text-xl md:text-2xl font-semibold tracking-tight",
        labelClassName: "text-[10px] sm:text-xs font-medium",
    },
    {
        label: "Pending cars",
        icon: Clock3,
        background: "linear-gradient(135deg, #4c60f1 0%, #4851d5 100%)",
        accentCircleColor: "rgba(255,255,255,0.35)",
        valueClassName: "text-lg sm:text-xl md:text-2xl font-semibold tracking-tight",
        labelClassName: "text-[10px] sm:text-xs font-medium",
        labelColor: "rgba(255,255,255,0.85)",
    },
    {
        label: "Active cars",
        icon: CarFront,
        background: "linear-gradient(135deg, #3f7bf4 0%, #2589f4 100%)",
        accentCircleColor: "rgba(255,255,255,0.35)",
        valueClassName: "text-lg sm:text-xl md:text-2xl font-semibold tracking-tight",
        labelClassName: "text-[10px] sm:text-xs font-medium",
    },
    {
        label: "Favorite cars",
        icon: CarFront,
        background: "linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)",
        accentCircleColor: "rgba(255,255,255,0.35)",
        valueClassName: "text-lg sm:text-xl md:text-2xl font-semibold tracking-tight",
        labelClassName: "text-[10px] sm:text-xs font-medium",
    },
];

const PAGE_SIZE = 6;

const CarComponent = () => {
    const router = useRouter();
    const { favorites, isFavorite, toggleFavorite } = useFavorites();

    const carsOverviewStats = useMemo(() => {
        const totalCars = sampleCars.length;
        const activeCars = sampleCars.filter((car) => car.owner?.toLowerCase().includes('first')).length;
        const pendingCars = totalCars - activeCars;
        const favoriteCars = favorites.size;

        const valuesMap: Record<string, string> = {
            "Total cars": totalCars.toString(),
            "Pending cars": pendingCars.toString(),
            "Active cars": activeCars.toString(),
            "Favorite cars": favoriteCars.toString(),
        };

        return carsOverviewCardConfig.map((card) => ({
            ...card,
            value: valuesMap[card.label] ?? "0",
        }));
    }, [favorites]);

    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(sampleCars.length > PAGE_SIZE);
    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    const visibleCars = useMemo(
        () => sampleCars.slice(0, visibleCount),
        [visibleCount],
    );

    useEffect(() => {
        if (!hasMore) return;

        const target = loadMoreRef.current;
        if (!target) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                if (!entry.isIntersecting) return;

                setIsLoadingMore(true);

                setTimeout(() => {
                    setVisibleCount((prev) => {
                        const next = Math.min(prev + PAGE_SIZE, sampleCars.length);
                        console.log('[CarList] Loading more cars', { prev, next });

                        if (next >= sampleCars.length) {
                            setHasMore(false);
                        }

                        return next;
                    });

                    setIsLoadingMore(false);
                }, 0);
            },
            {
                root: null,
                rootMargin: '0px 0px 200px 0px',
                threshold: 0.1,
            },
        );

        observer.observe(target);

        return () => {
            observer.disconnect();
        };
    }, [hasMore]);

    const handleCarClick = (carId: string) => {
        router.push(`/car/${carId}`);
    };

    const handleFavoriteClick = (e: React.MouseEvent, carId: string) => {
        e.stopPropagation(); // Prevent card click
        toggleFavorite(carId);
    };

    return (
        <div>

            {/* Page Header */}
            <PageHeader
                title="View All Cars"
                description="View all cars"
            />

            {/* Cars Overview */}
            <div className="mt-2 mb-2 sm:mt-3 md:mt-4 lg:mt-5 sm:mb-5 md:mb-8 lg:mb-10 grid grid-cols-1 gap-1.5 sm:grid-cols-2 sm:gap-2 lg:grid-cols-4 xl:grid-cols-4">
                {carsOverviewStats.map((card) => (
                    <OverviewStatCard
                        key={card.label}
                        {...card}
                    />
                ))}
            </div>

            {/* Cars List */}
            <div className="mt-4 sm:mt-6 mb-8 sm:mb-12">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 md:gap-5 lg:gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
                    {visibleCars.map((car) => (
                        <CarCard
                            key={car.id}
                            car={car}
                            onClick={handleCarClick}
                            showFavorite={true}
                            isFavorite={isFavorite(car.id)}
                            onFavoriteClick={handleFavoriteClick}
                        />
                    ))}
                </div>
                {hasMore && (
                    <div
                        ref={loadMoreRef}
                        className="mt-4 h-8 flex items-center justify-center text-[11px] sm:text-xs text-gray-500"
                    >
                        {isLoadingMore ? 'Loading more cars…' : 'Scroll to load more cars'}
                    </div>
                )}
            </div>

        </div>
    )
}
export default CarComponent;