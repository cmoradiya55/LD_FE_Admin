'use client';
import FeaturedImage from '@/components/car/FeaturedImage';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/Button/Button';
import { AlertCircle, CalendarDays, LucideIcon, Shield, Fuel, Users, Gauge, MapPin, UserRound, Cog, Settings2, Factory, Heart, TrendingUp, Flag, Share2, ArrowLeft, Sparkles, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { CarData } from '../data';
import { useFavorites } from '@/contexts/FavoritesContext';
import Image from 'next/image';

interface CarDetailsComponentProps {
    car: CarData;
}

type CarOverviewDetail = {
    label: string;
    value: string;
    icon: LucideIcon;
};

const CarDetailsComponent = ({ car }: CarDetailsComponentProps) => {
    const router = useRouter();
    const { isFavorite, toggleFavorite } = useFavorites();
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalSlideIndex, setModalSlideIndex] = useState(0);

    const handleThumbnailClick = useCallback((index: number) => {
        setModalSlideIndex(index);
        const el = thumbnailRefs.current[index];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, []);

    const carOverviewDetails: CarOverviewDetail[] = [
        { label: 'Registration Year', value: car.registrationYear, icon: CalendarDays },
        { label: 'Insurance', value: car.insurance, icon: Shield },
        { label: 'Fuel Type', value: car.fuelType, icon: Fuel },
        { label: 'Seats', value: car.seats, icon: Users },
        { label: 'Kms Driven', value: car.kmsDriven, icon: Gauge },
        { label: 'RTO', value: car.rto, icon: MapPin },
        { label: 'Ownership', value: car.owner, icon: UserRound },
        { label: 'Engine Displacement', value: car.engineDisplacement, icon: Cog },
        { label: 'Transmission', value: car.transmission, icon: Settings2 },
        { label: 'Year of Manufacture', value: car.yearOfManufacture, icon: Factory },
    ];

    const categories = useMemo(() => {
        if (!car) return [];
        const exteriorOption = car.detailOptions.find(opt => opt.label === 'Exterior');
        const categories = [
            {
                label: 'Exterior',
                images: [car.image, ...(exteriorOption?.images || [])]
            },
            ...car.detailOptions
                .filter(opt => opt.label !== 'Exterior')
                .map(opt => ({
                    label: opt.label,
                    images: opt.images || [],
                })),
        ];
        return categories.filter(cat => cat.images.length > 0);
    }, [car]);

    const slides = useMemo(
        () =>
            categories.flatMap((category, categoryIndex) =>
                (category.images || []).map((image) => ({
                    categoryIndex,
                    image,
                })),
            ),
        [categories],
    );

    const closeImageModal = useCallback(() => {
        setShowImageModal(false);
    }, []);

    const currentSlide = slides[modalSlideIndex] ?? slides[0];
    const currentCategoryIndex = currentSlide?.categoryIndex ?? 0;
    const currentImage = currentSlide?.image ?? car.image;
    const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleCategoryChange = useCallback((index: number) => {
        setModalSlideIndex(index);
    }, []);

    const nextImage = useCallback(() => {
        if (!slides.length) return;
        setModalSlideIndex((prev) => (prev + 1) % slides.length);
    }, [slides.length]);

    const previousImage = useCallback(() => {
        if (!slides.length) return;
        setModalSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    }, [slides.length]);

    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
    }, []);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
    }, []);

    return (
        <div className="space-y-3 sm:space-y-4">

            {/* Main Content */}
            <section className="pb-4 sm:pb-6 md:pb-8">
                <div className="mx-auto px-3 sm:px-5 lg:px-6">
                    <div className="max-w-7xl mx-auto">

                        {/* Back Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.back()}
                            className="bg-white text-blue-500 hover:text-blue-800 backdrop-blur-sm border border-blue-500 shadow-sm hover:bg-blue-100 transition-colors px-3 py-2 rounded-full flex items-center gap-1.5 text-xs mb-4"
                        >
                            <ArrowLeft className="w-3.5 h-3.5" />
                            <span className="font-medium tracking-tight">Back</span>
                        </Button>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                            {/* Main Content */}
                            <article className="lg:col-span-7 space-y-6">

                                {/* Featured Image */}
                                <FeaturedImage
                                    src={car.image}
                                    alt={car.name}
                                    detailOptions={car.detailOptions}
                                />

                                {/* Car Overview */}
                                <div className="rounded-2xl border bg-white/60 backdrop-blur-sm shadow-sm">
                                    <div className="px-4 py-3 sm:px-5 sm:py-4 border-b flex items-center justify-between">
                                        <div>
                                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Key Specs</p>
                                            <h3 className="text-lg font-bold text-gray-900 mt-0.5">Car Overview</h3>
                                        </div>
                                        <div className="hidden sm:flex items-center gap-1.5 text-xs text-blue-600 font-semibold">
                                            <AlertCircle className="w-3.5 h-3.5" />
                                            Verified Listing
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-0.5">
                                        {carOverviewDetails.map((item) => (
                                            <div
                                                key={item.label}
                                                className="flex items-center gap-2.5 px-4 py-3 sm:px-5 sm:py-4 border-t border-gray-100 first:border-t-0 sm:first:border-t-0"
                                            >
                                                <span className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                    <item.icon className="w-4 h-4" />
                                                </span>
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{item.label}</p>
                                                    <p className="text-sm font-semibold text-gray-900">{item.value}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </article>

                            {/* Sidebar */}
                            <aside className="lg:col-span-5">
                                <div className="lg:sticky lg:top-1 space-y-4 sm:space-y-5 md:space-y-6">
                                    <div className="rounded-2xl border shadow-lg bg-white">
                                        <div className="p-4 sm:p-5 border-b">
                                            <div className="flex items-start justify-between gap-2.5">
                                                <div>
                                                    <p className="text-[11px] uppercase tracking-wide text-gray-500 font-semibold">{car.year}</p>
                                                    <h3 className="text-lg font-semibold text-gray-900 leading-tight">{car.name}</h3>
                                                </div>
                                                <button
                                                    className={`p-1.5 rounded-full border transition-colors ${isFavorite(car.id) ? 'text-red-600 bg-red-50 border-red-200' : 'text-gray-500 hover:text-red-500 hover:bg-red-100 hover:border-red-200'}`}
                                                    aria-label="Save listing"
                                                    aria-pressed={isFavorite(car.id)}
                                                    onClick={() => toggleFavorite(car.id)}
                                                >
                                                    <Heart className="w-4 h-4" fill={isFavorite(car.id) ? 'currentColor' : 'none'} />
                                                </button>
                                            </div>

                                            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
                                                <span>{car.kmsDriven}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{car.fuelType}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{car.transmission}</span>
                                                <span className="text-gray-300">•</span>
                                                <span>{car.owner}</span>
                                            </div>

                                            <div className="mt-4">
                                                <div className="text-2xl font-bold text-gray-900">{car.price}</div>
                                                <div className="mt-1.5 text-xs">
                                                    {/* {car.emi && (
                                                        <>
                                                            <span className="text-blue-600 font-semibold cursor-pointer">EMI starts @ {car.emi}</span>
                                                            <span className="text-gray-400 mx-1.5">•</span>
                                                        </>
                                                    )} */}
                                                    {car.newCarPrice && (
                                                        <span className="text-gray-500">New Car Price {car.newCarPrice}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 sm:p-5 border-b space-y-3">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                                <span className="text-sm font-medium leading-tight">{car.location}</span>
                                            </div>
                                            {/* <label className="flex items-center gap-1.5 text-xs font-medium text-gray-600 cursor-pointer select-none">
                                                <input type="checkbox" className="rounded border-gray-300 text-blue-500 focus:ring-blue-400" />
                                                Compare
                                            </label> */}
                                            {/* <button className="w-full rounded-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm py-2.5 shadow-md transition-colors">
                                                View Seller Details
                                            </button> */}
                                        </div>

                                        {/* {car.views && (
                                            <div className="px-4 sm:px-5 py-3 bg-gray-50 border-b flex items-center gap-2 text-xs text-gray-600">
                                                <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                                                <span>Trending! Viewed by {car.views} users</span>
                                            </div>
                                        )} */}

                                        <div className="flex items-center justify-between px-4 sm:px-5 py-3 text-xs text-gray-600">
                                            {/* <button className="flex items-center gap-1.5 font-medium hover:text-blue-500 transition-colors">
                                                <Flag className="w-3.5 h-3.5" />
                                                Report Ad
                                            </button> */}
                                            <button className="flex items-center gap-1.5 font-medium hover:text-blue-500 transition-colors">
                                                <Share2 className="w-3.5 h-3.5" />
                                                Share
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </aside>
                        </div>

                    </div>
                </div>
            </section>

            {/* Image Preview Modal */}
            {showImageModal && (
                <div
                    className="fixed inset-0 z-[60] flex flex-col bg-black/95 backdrop-blur-sm !m-0"
                    onClick={closeImageModal}
                >
                    {/* Header with Category Tabs and Close Button */}
                    <div className="relative w-full px-4 py-3 bg-black/80 backdrop-blur-md border-b border-white/10">
                        <div className="max-w-7xl mx-auto flex items-center justify-between">
                            {/* Category Tabs */}
                            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto scrollbar-hide">
                                {categories.map((category, index) => {
                                    const isActive = index === currentCategoryIndex;
                                    const Icon = category.label.toLowerCase() === 'highlights' ? Sparkles : undefined;

                                    return (
                                        <button
                                            key={category.label}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleCategoryChange(index);
                                            }}
                                            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${isActive
                                                ? 'bg-primary/90 text-white'
                                                : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
                                                }`}
                                        >
                                            {Icon && <Icon className="w-4 h-4" />}
                                            <span>{category.label}</span>
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={closeImageModal}
                                className=" ml-4 p-2 rounded-full bg-primary/90 hover:bg-primary/60 text-white transition-colors flex-shrink-0"
                                aria-label="Close modal"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Main Image Area */}
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">

                        {/* Previous Button */}
                        {slides.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    previousImage();
                                }}
                                className="hidden md:flex absolute left-4 md:left-8 z-20 p-1 rounded-full bg-white/60 hover:bg-gray-100 text-gray-900 shadow-lg transition-all hover:scale-105"
                                aria-label="Previous image"
                            >
                                <ChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        )}

                        {/* Next Button */}
                        {slides.length > 1 && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    nextImage();
                                }}
                                className="hidden md:flex absolute right-4 md:right-8 z-20 p-1 rounded-full bg-white/60 hover:bg-gray-100 text-gray-900 shadow-lg transition-all hover:scale-105"
                                aria-label="Next image"
                            >
                                <ChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
                            </button>
                        )}

                        {/* Image Container */}
                        <div
                            className="relative w-full h-full flex items-center justify-center p-4 sm:p-8"
                            onClick={(e) => e.stopPropagation()}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                        >
                            <div className="relative w-full h-full max-w-7xl">
                                <Image
                                    src={currentImage}
                                    alt={`${car.name} - ${categories[currentCategoryIndex]?.label || 'Image'} ${modalSlideIndex + 1}`}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>

                        {/* Image Counter */}
                        {slides.length > 1 && (
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 z-10 px-2 py-0.5 rounded-full bg-white/60 backdrop-blur-sm text-white text-sm font-medium">
                                {modalSlideIndex + 1} / {slides.length}
                            </div>
                        )}
                    </div>

                    {/* Thumbnail Gallery */}
                    {slides.length > 1 && (
                        <div className="w-full px-4 py-4 bg-black/80 backdrop-blur-md border-t border-white/10">
                            <div className="max-w-7xl mx-auto">
                                <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide pb-2 scroll-smooth">
                                    {slides.map((slide, index) => (
                                        <button
                                            key={index}
                                            ref={(el) => {
                                                thumbnailRefs.current[index] = el;
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleThumbnailClick(index);
                                            }}
                                            className={`relative flex-shrink-0 w-16 h-16 sm:w-24 sm:h-20 rounded-lg overflow-hidden border-2 transition-all ${index === modalSlideIndex
                                                ? 'border-primary'
                                                : 'border-white/20 hover:border-white/40'
                                                }`}
                                        >
                                            <Image
                                                src={slide.image}
                                                alt={`Thumbnail ${index + 1}`}
                                                fill
                                                sizes="96px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    )
}

export default CarDetailsComponent;