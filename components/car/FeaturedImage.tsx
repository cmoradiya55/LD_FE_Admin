'use client';

import Image from 'next/image';
import { Sparkles, ChevronLeft, ChevronRight, type LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import CarDetailCurve from './CarDetailCurve';
import type { DetailOptionData, DetailOptionIcon } from '@/app/(admin)/car/data';

interface FeaturedImageProps {
    src: string;
    alt: string;
    detailOptions?: DetailOptionData[];
    wrapperClassName?: string;
    imageClassName?: string;
}

type DetailOption = {
    label: string;
    images?: string[];
    icon?: LucideIcon;
    isActive?: boolean;
};

const iconMap: Record<DetailOptionIcon, LucideIcon> = {
    sparkles: Sparkles,
};

const normalizeDetailOptions = (options: DetailOptionData[] | undefined, fallbackImage: string): DetailOption[] => {
    const sourceOptions = options?.length
        ? options
        : [
            {
                label: 'Exterior',
                images: [fallbackImage],
                isActive: true,
            },
        ];

    return sourceOptions.map((option) => ({
        ...option,
        images: option.images?.length ? option.images : [fallbackImage],
        icon: option.icon ? iconMap[option.icon] : undefined,
    }));
};

const FeaturedImage = ({
    src,
    alt,
    detailOptions: detailOptionsProp,
    wrapperClassName,
    imageClassName,
}: FeaturedImageProps) => {
    const detailOptions = normalizeDetailOptions(detailOptionsProp, src);
    const slideList = detailOptions.flatMap((option, optionIndex) =>
        (option.images && option.images.length ? option.images : [src]).map((image) => ({
            optionIndex,
            image,
        })),
    );
    const slides = slideList.length
        ? slideList
        : [
            {
                optionIndex: 0,
                image: src,
            },
        ];

    const defaultActiveIndex = Math.max(
        detailOptions.findIndex((option) => option.isActive),
        0,
    );
    const defaultSlideIndex = Math.max(
        slides.findIndex((slide) => slide.optionIndex === defaultActiveIndex),
        0,
    );

    const [currentSlideIndex, setCurrentSlideIndex] = useState(defaultSlideIndex);

    const currentSlide = slides[currentSlideIndex] ?? slides[0];
    const activeOptionIndex = currentSlide?.optionIndex ?? 0;
    const displayedImage = currentSlide?.image ?? src;

    const canSlide = slides.length > 1;

    const handlePrev = () => {
        setCurrentSlideIndex((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const handleNext = () => {
        setCurrentSlideIndex((prev) => (prev + 1) % slides.length);
    };

    const handleOptionSelect = (optionIndex: number) => {
        const slideIndex = slides.findIndex((slide) => slide.optionIndex === optionIndex);
        if (slideIndex !== -1) {
            setCurrentSlideIndex(slideIndex);
        }
    };

    return (
        <div className={cn('', wrapperClassName)}>
            <div className="max-w-6xl mx-auto">

                <div className="relative rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-md group bg-black/5">
                    <div className="relative w-full sm:w-[90%] h-72 sm:h-64 md:h-80 lg:h-96 xl:h-[440px] mx-auto">
                        <div className="relative w-full h-full bg-transparent rounded-[28px]">
                            <Image
                                src={displayedImage}
                                alt={alt}
                                fill
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1024px"
                                className={cn(
                                    'object-contain rounded-[28px] transition-transform duration-500 ease-out p-2 sm:p-4',
                                    imageClassName,
                                )}
                            />
                            {canSlide && (
                                <>
                                    <button
                                        type="button"
                                        onClick={handlePrev}
                                        aria-label="View previous image"
                                        className="absolute -left-5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow-lg transition hover:bg-black/60"
                                    >
                                        <ChevronLeft className="h-6 w-6" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleNext}
                                        aria-label="View next image"
                                        className="absolute -right-5 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1 text-white shadow-lg transition hover:bg-black/60"
                                    >
                                        <ChevronRight className="h-6 w-6" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="relative w-full h-full">
                        <CarDetailCurve className="w-full" />
                    </div>
                    <div className="absolute bottom-1 left-1/2 z-10 flex w-full -translate-x-1/2 flex-wrap items-center justify-center gap-4 px-4 sm:gap-6">
                        {detailOptions.map((option, index) => {
                            const Icon = option.icon;
                            const isActive = index === activeOptionIndex;
                            const optionImages = option.images?.length ? option.images : [src];
                            const activeImageIndex = optionImages.indexOf(displayedImage);
                            const previewImage = isActive && activeImageIndex !== -1 ? displayedImage : optionImages[0];
                            const showActiveBadge = isActive && activeImageIndex !== -1 && optionImages.length > 1;
                            const showIconPreview =
                                Icon && option.label?.toLowerCase() === 'highlights';

                            return (
                                <button
                                    key={option.label}
                                    type="button"
                                    onClick={() => handleOptionSelect(index)}
                                    className="flex flex-col items-center gap-2 text-center focus:outline-none"
                                >
                                    <span
                                        className={cn(
                                            'relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border-2 bg-gradient-to-b from-white/10 to-white/5 transition-all duration-300',
                                            isActive ? 'border-blue-600/80 shadow-blue-500/80' : 'border-gray-500/50',
                                        )}
                                    >
                                        {/* {showIconPreview && Icon ? (
                                            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gray-700 shadow-md">
                                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                            </span>
                                        ) : previewImage ? ( */}
                                            <span className="relative block h-12 w-12 sm:h-14 sm:w-14 overflow-hidden rounded-full">
                                                <Image
                                                    src={previewImage}
                                                    alt={`${option.label} preview`}
                                                    fill
                                                    sizes="64px"
                                                    className="object-cover"
                                                />
                                            </span>
                                        {/* ) : Icon ? (
                                            <span className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-b from-gray-600 to-gray-800">
                                                <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                                            </span>
                                        ) : null} */}
                                    </span>
                                    <span
                                        className={cn(
                                            'text-xs sm:text-sm font-semibold tracking-wide uppercase',
                                            isActive ? 'text-blue-600' : 'text-gray-800',
                                        )}
                                    >
                                        {option.label}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default FeaturedImage;

