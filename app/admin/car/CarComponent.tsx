"use client";
import { OverviewStatCard, PageHeader } from '@/components/common';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Car,
    CarFront,
    Clock3,
    Fuel,
    Gauge,
    MapPin,
    CalendarDays,
    Heart,
    ShieldCheck,
    BadgeCheck,
    UserRoundCheck,
} from 'lucide-react';
import Image from 'next/image';
import { sampleCars } from './data';
import { useFavorites } from '@/contexts/FavoritesContext';

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
                        <div
                            key={car.id}
                            onClick={() => handleCarClick(car.id)}
                            className="group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10"
                        >
                            {/* Gradient Border Effect */}
                            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 p-[1px] transition-all duration-300 group-hover:from-blue-500/20 group-hover:via-purple-500/20 group-hover:to-pink-500/20">
                                <div className="h-full w-full rounded-xl bg-white"></div>
                            </div>

                            {/* Content Container */}
                            <div className="relative">
                                {/* Car Image */}
                                <div className="relative">
                                    <div className="h-36 sm:h-44 md:h-48 w-full overflow-hidden relative bg-[radial-gradient(circle_at_center,_#ffffff,_#f7f7fb,_#e5e7eb)] dark:bg-[radial-gradient(circle_at_center,_#f5f7fa,_#e5e7eb,_#d1d5db)]">
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.9),_rgba(226,232,240,0.45),_rgba(148,163,184,0.35))] opacity-95 pointer-events-none"></div>
                                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/15 via-transparent to-transparent z-10 pointer-events-none"></div>
                                        <div className="relative h-full w-full z-20 flex items-center justify-center">
                                            <Image
                                                src={car.image}
                                                alt={car.name}
                                                fill
                                                className="object-contain transition-transform duration-500 drop-shadow-[0_10px_25px_rgba(0,0,0,0.25)] scale-[0.85]"
                                            />
                                        </div>

                                        {/* Favorite Button */}
                                        <button
                                            onClick={(e) => handleFavoriteClick(e, car.id)}
                                            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                                            aria-label="Add to favorites"
                                        >
                                            <Heart
                                                className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-200 ${isFavorite(car.id)
                                                    ? 'fill-red-500 text-red-500'
                                                    : 'text-gray-600 hover:text-red-500'
                                                    }`}
                                            />
                                        </button>

                                        {/* Year Badge */}
                                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-900 shadow-lg">
                                            {car.year}
                                        </div>

                                    </div>

                                    {/* Badge - Assured or Private Seller */}
                                    <div className="absolute bottom-0 left-0 z-30">
                                        <div className='relative'>
                                            <Image src="/CarListCurve.svg" alt="CarListCurve" width={160} height={100} />
                                        </div>
                                        <div className='absolute bottom-0 left-1 flex items-center gap-1 text-[12px] sm:text-xs font-medium text-gray-700 p-1'>
                                            {car.badgeType === 'assured' ? (
                                                <>
                                                    <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 font-bold transition-colors" />
                                                    <span>LINK DRIVE Assured</span>
                                                </>
                                            ) : (
                                                <>
                                                    <UserRoundCheck className="h-3 w-3 ml-2 sm:h-3.5 sm:w-3.5 text-orange-600 font-bold transition-colors" />
                                                    <span>Private Seller</span>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                {/* Car Details */}
                                <div className="p-3 sm:p-4 space-y-2 z-200">
                                    {/* Car Name and Price */}
                                    <div>
                                        <div className="flex items-start justify-between gap-1.5 sm:gap-2">
                                            <h3 className="text-sm sm:text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1 flex-1">
                                                {car.name}
                                            </h3>
                                            <div className="text-sm sm:text-base font-bold text-blue-600 whitespace-nowrap">
                                                {car.price}
                                            </div>
                                        </div>
                                        {/* <div className="mt-0.5 text-[10px] sm:text-xs text-gray-500 flex items-center gap-1">
                                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            <span className="line-clamp-1">{car.location}</span>
                                        </div> */}
                                    </div>

                                    {/* Specs Grid */}
                                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1.5 sm:pt-2 border-t border-gray-100">
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
                                            <Gauge className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{car.kmsDriven}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors duration-300">
                                            <Fuel className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{car.fuelType}</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5 sm:gap-1 p-1.5 sm:p-2 rounded-lg bg-gray-100 group-hover:bg-blue-100 transition-colors">
                                            <Car className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                            <span className="text-[10px] sm:text-xs font-medium text-gray-700 text-center leading-tight">{car.transmission}</span>
                                        </div>
                                    </div>

                                    {/* Owner Badge */}
                                    <div className="flex items-center justify-between pt-1.5 sm:pt-2">
                                        <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-700">
                                            <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                                            <span>{car.owner}</span>
                                        </div>
                                    </div>

                                </div>

                                {/* Location Badge */}
                                <div className="flex items-center justify-between pt-1">
                                    <div className="inline-flex items-center gap-1 w-full sm:gap-1.5 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-2.5 text-[10px] sm:text-[13px] font-medium text-gray-600">
                                        <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600 font-bold group-hover:text-blue-600 transition-colors" />
                                        <span>{car.location}</span>
                                    </div>
                                </div>

                            </div>
                        </div>
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