"use client";
import React from 'react';
import Image from 'next/image';
import {
    Car,
    Fuel,
    Gauge,
    MapPin,
    CalendarDays,
    Heart,
    BadgeCheck,
    UserRoundCheck,
    CheckCircle2,
    Clock,
    UserRound,
    FileText,
    XCircle,
    AlertCircle,
    Ban,
} from 'lucide-react';
import { CarData } from '@/lib/CarData';
import { UsedCarListingStatus } from '@/lib/data';

interface CarCardProps {
    car: CarData;
    onClick?: (carId: string) => void;
    showFavorite?: boolean;
    isFavorite?: boolean;
    onFavoriteClick?: (e: React.MouseEvent, carId: string) => void;
    showStatusBadge?: boolean;
    status?: UsedCarListingStatus;
    className?: string;
}

const getStatusBadgeConfig = (status: UsedCarListingStatus): { bgColor: string; icon: React.ReactNode; label: string } => {
    switch (status) {
        case UsedCarListingStatus.PENDING:
            return { bgColor: 'bg-gray-500', icon: <Clock className="h-3 w-3" />, label: 'Pending' };
        case UsedCarListingStatus.INSPECTOR_ASSIGNED:
            return { bgColor: 'bg-blue-500', icon: <UserRound className="h-3 w-3" />, label: 'Inspector Assigned' };
        case UsedCarListingStatus.INSPECTION_STARTED:
            return { bgColor: 'bg-yellow-500', icon: <Clock className="h-3 w-3" />, label: 'Inspection Started' };
        case UsedCarListingStatus.INSPECTION_COMPLETED:
            return { bgColor: 'bg-emerald-500', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Inspection Completed' };
        case UsedCarListingStatus.DETAILS_UPDATED_BY_STAFF:
            return { bgColor: 'bg-purple-500', icon: <FileText className="h-3 w-3" />, label: 'Details Updated' };
        case UsedCarListingStatus.APPROVED_BY_MANAGER:
            return { bgColor: 'bg-indigo-500', icon: <BadgeCheck className="h-3 w-3" />, label: 'Approved by Manager' };
        case UsedCarListingStatus.APPROVED_BY_ADMIN:
            return { bgColor: 'bg-primary-500', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Approved by Admin' };
        case UsedCarListingStatus.LISTED:
            return { bgColor: 'bg-green-500', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Listed' };
        case UsedCarListingStatus.SOLD:
            return { bgColor: 'bg-purple-600', icon: <CheckCircle2 className="h-3 w-3" />, label: 'Sold' };
        case UsedCarListingStatus.REJECTED_BY_MANAGER:
            return { bgColor: 'bg-red-500', icon: <XCircle className="h-3 w-3" />, label: 'Rejected by Manager' };
        case UsedCarListingStatus.REJECTED_BY_ADMIN:
            return { bgColor: 'bg-red-500', icon: <XCircle className="h-3 w-3" />, label: 'Rejected by Admin' };
        case UsedCarListingStatus.REJECTED_BY_CUSTOMER:
            return { bgColor: 'bg-red-500', icon: <XCircle className="h-3 w-3" />, label: 'Rejected by Customer' };
        case UsedCarListingStatus.EXPIRED:
            return { bgColor: 'bg-orange-500', icon: <AlertCircle className="h-3 w-3" />, label: 'Expired' };
        case UsedCarListingStatus.CANCELLED:
            return { bgColor: 'bg-gray-500', icon: <Ban className="h-3 w-3" />, label: 'Cancelled' };
        default:
            return { bgColor: 'bg-gray-500', icon: <Clock className="h-3 w-3" />, label: 'Unknown' };
    }
};

const CarCard: React.FC<CarCardProps> = ({
    car,
    onClick,
    showFavorite = false,
    isFavorite = false,
    onFavoriteClick,
    showStatusBadge = false,
    status,
    className = "",
}) => {
    const statusConfig = status ? getStatusBadgeConfig(status) : null;
    const handleClick = () => {
        if (onClick) {
            onClick(car.id);
        }
    };

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onFavoriteClick) {
            onFavoriteClick(e, car.id);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`group relative cursor-pointer overflow-hidden rounded-xl bg-white transition-all duration-300 ${className}`}
        >

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
                        {showFavorite && (
                            <button
                                onClick={handleFavoriteClick}
                                className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20 flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-200 hover:bg-white hover:scale-110 active:scale-95"
                                aria-label="Add to favorites"
                            >
                                <Heart
                                    className={`h-3 w-3 sm:h-3.5 sm:w-3.5 transition-all duration-200 ${isFavorite
                                        ? 'fill-red-500 text-red-500'
                                        : 'text-gray-600 hover:text-red-500'
                                        }`}
                                />
                            </button>
                        )}

                        {/* Year Badge */}
                        <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-20 rounded-full bg-white/95 backdrop-blur-sm px-2 py-1 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-bold text-gray-900 shadow-lg">
                            {car.year}
                        </div>

                        {/* Status Badge (used by Manager lists) */}
                        {showStatusBadge && statusConfig && (
                            <div className="absolute top-2 right-2 sm:top-3 sm:right-3 z-20">
                                <div className={`flex items-center gap-1.5 ${statusConfig.bgColor} text-white px-2 py-1 rounded-full shadow-lg`}>
                                    {statusConfig.icon}
                                    <span className="text-[11px] font-semibold">{statusConfig.label}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Badge - Assured or Private Seller */}
                    <div className="absolute bottom-0 left-0 z-30">
                        <div className='relative'>
                            <Image src="/CarListCurve.svg" alt="CarListCurve" width={180} height={100} />
                        </div>
                        <div className='absolute bottom-0 left-1 flex items-center gap-1 text-[12px] sm:text-xs font-medium text-gray-700 p-1'>
                            {car.badgeType === 'assured' ? (
                                <>
                                    <BadgeCheck className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-blue-600 font-bold transition-colors" />
                                    <span>LINK DRIVE Assured</span>
                                </>
                            ) : (
                                <>
                                    <UserRoundCheck className="h-3 w-3 ml-2 sm:h-3.5 sm:w-3.5 text-primary-600 font-bold transition-colors" />
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
                                {car.linkDrivePrice || car.managerSuggestedPrice || car.customerExpectedPrice}
                            </div>
                        </div>
                        {/* Price Details */}
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                            {car.customerExpectedPrice && (
                                <div className="flex items-center gap-1 px-2 py-1 rounded-md bg-primary-50 border border-primary-200">
                                    <span className="text-[10px] sm:text-xs font-medium text-primary-700">
                                        Customer Expected: {car.customerExpectedPrice}
                                    </span>
                                </div>
                            )}
                        </div>
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
                        <div className="inline-flex items-center gap-1 sm:gap-1.5 rounded-full bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[10px] sm:text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                            <CalendarDays className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span>{car.owner}</span>
                        </div>
                    </div>
                </div>

                {/* Location Badge */}
                {car.location && (
                    <div className="flex items-center justify-between pt-1">
                        <div className="inline-flex items-center gap-1 w-full sm:gap-1.5 bg-gray-100 px-2 py-0.5 sm:px-2.5 sm:py-2.5 text-[10px] sm:text-[13px] font-medium text-gray-600 rounded-b-lg group-hover:text-primary-600 transition-colors">
                            <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-600 font-bold group-hover:text-primary-600 transition-colors" />
                            <span className="line-clamp-1">{car.location}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarCard;

