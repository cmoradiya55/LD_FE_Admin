"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    OverviewStatCard,
    PageHeader,
} from "@/components/common";
import {
    Car,
    FileText,
    Clock,
    CheckCircle2,
    ArrowRight,
    Calendar,
    Bell,
    Users,
    TrendingUp,
    Activity,
} from "lucide-react";
import { Button } from "@/components/Button/Button";

const StaffDashboardComponent = () => {
    const router = useRouter();

    // Stats data
    const stats = [
        {
            label: "Total Cars",
            value: "124",
            icon: Car,
            background: "linear-gradient(135deg, #4b6bfb 0%, #3b82f6 100%)",
            accentCircleColor: "rgba(255,255,255,0.4)",
        },
        {
            label: "Pending Tasks",
            value: "8",
            icon: Clock,
            background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
        {
            label: "Completed",
            value: "96",
            icon: CheckCircle2,
            background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
        {
            label: "Documents",
            value: "42",
            icon: FileText,
            background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
            accentCircleColor: "rgba(255,255,255,0.35)",
        },
    ];

    // Quick actions
    const quickActions = [
        {
            id: 1,
            title: "View Car List",
            description: "Browse all available cars",
            icon: Car,
            color: "from-blue-600 to-cyan-500",
            route: "/staff/carList",
        },
        {
            id: 2,
            title: "Document Upload",
            description: "Upload and manage documents",
            icon: FileText,
            color: "from-purple-600 to-indigo-500",
            route: "/staff/document-upload",
        },
        {
            id: 3,
            title: "Notifications",
            description: "View latest updates",
            icon: Bell,
            color: "from-teal-500 to-emerald-500",
            route: "/staff/notifications",
        },
    ];

    // Recent activity
    const recentActivity = [
        {
            id: 1,
            type: "car",
            title: "New car added",
            description: "Maruti Swift ZXI CNG",
            time: "2 hours ago",
            icon: Car,
            color: "text-blue-600 bg-blue-50",
        },
        {
            id: 2,
            type: "document",
            title: "Document verified",
            description: "Insurance document approved",
            time: "5 hours ago",
            icon: FileText,
            color: "text-green-600 bg-green-50",
        },
        {
            id: 3,
            type: "task",
            title: "Task completed",
            description: "Car inspection completed",
            time: "1 day ago",
            icon: CheckCircle2,
            color: "text-purple-600 bg-purple-50",
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Page Header */}
            <PageHeader
                title="Staff Dashboard"
                description="Welcome back! Here's an overview of your activities."
            />

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                {stats.map((stat) => (
                    <OverviewStatCard
                        key={stat.label}
                        label={stat.label}
                        value={stat.value}
                        icon={stat.icon}
                        background={stat.background}
                        accentCircleColor={stat.accentCircleColor}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {/* Quick Actions */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Quick Actions
                        </h2>
                        {/* <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> */}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {quickActions.map((action) => {
                            const Icon = action.icon;
                            return (
                                <button
                                    key={action.id}
                                    onClick={() => router.push(action.route)}
                                    className="group w-full relative overflow-hidden rounded-xl bg-white p-4 sm:p-5 shadow-sm border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left"
                                >
                                    <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`} />
                                    <div className="relative flex items-center gap-3 sm:gap-4">
                                        <div className={`flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl bg-gradient-to-r ${action.color} text-white shadow-sm group-hover:scale-105 transition-transform duration-200`}>
                                            <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {action.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                                {action.description}
                                            </p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all duration-200 flex-shrink-0" />
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* Recent Activity */}
                <section className="space-y-3 sm:space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                            Recent Activity
                        </h2>
                        {/* <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> */}
                    </div>
                    <div className="space-y-2 sm:space-y-3">
                        {recentActivity.map((activity) => {
                            const Icon = activity.icon;
                            return (
                                <div
                                    key={activity.id}
                                    className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                                >
                                    <div className={`flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg ${activity.color} flex-shrink-0`}>
                                        <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                                            {activity.title}
                                        </h3>
                                        <p className="text-xs sm:text-sm text-gray-600 mt-0.5">
                                            {activity.description}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1.5">
                                            {activity.time}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
                
            </div>
        </div>
    );
};

export default StaffDashboardComponent;