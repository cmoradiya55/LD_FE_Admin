'use client';
import FeaturedImage from '@/components/car/FeaturedImage';
import PageHeader from '@/components/common/PageHeader';
import { Button } from '@/components/ui/button';
import { AlertCircle, CalendarDays, LucideIcon, Shield, Fuel, Users, Gauge, MapPin, UserRound, Cog, Settings2, Factory, Heart, TrendingUp, Flag, Share2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';
import { CarData } from '../data';
import { useFavorites } from '@/contexts/FavoritesContext';

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

    return (
        <div className="space-y-3 sm:space-y-4">

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

            {/* Main Content */}
            <section className="pb-4 sm:pb-6 md:pb-8">
                <div className="container mx-auto px-3 sm:px-5 lg:px-6">
                    <div className="max-w-7xl mx-auto">
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
        </div>
    )
}

export default CarDetailsComponent;