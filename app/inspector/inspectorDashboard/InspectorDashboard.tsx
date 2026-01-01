"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    OverviewStatCard,
} from "@/components/common";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/Button/Button";
import {
    ClipboardCheck,
    Clock,
    CheckCircle2,
    Car,
    FileText,
    Bell,
    ArrowRight,
    Calendar,
    TrendingUp,
    AlertCircle,
    Sparkles,
} from "lucide-react";

const InspectorDashboard = () => {
    const router = useRouter();

    const stats = {
        totalAssigned: 15,
        completed: 8,
        inProgress: 4,
        pending: 3,
    };

    const quickActions = [
        {
            id: 1,
            title: "View Car List",
            description: "Browse assigned inspections",
            icon: Car,
            color: "from-blue-600 to-cyan-500",
            route: "/inspector/carList",
        },
        {
            id: 2,
            title: "Car Inspection Form",
            description: "Submit your inspection form",
            icon: FileText,
            color: "from-teal-500 to-emerald-500",
            route: "/inspector/carInspection",
        },
        {
            id: 3,
            title: "Notifications",
            description: "View latest updates",
            icon: Bell,
            color: "from-cyan-500 to-blue-600",
            route: "/inspector/notifications",
        },
    ];

    const upcomingTasks = [
        {
            id: 1,
            carId: "#CAR-1234",
            carName: "Maruti Swift",
            dueDate: "Today",
            priority: "high",
            status: "in-progress",
        },
        {
            id: 2,
            carId: "#CAR-1235",
            carName: "Hyundai i20",
            dueDate: "Tomorrow",
            priority: "medium",
            status: "pending",
        },
        {
            id: 3,
            carId: "#CAR-1236",
            carName: "Honda City",
            dueDate: "Dec 25",
            priority: "low",
            status: "pending",
        },
    ];

    const recentCompletions = [
        {
            id: 1,
            carId: "#CAR-1220",
            carName: "Toyota Innova",
            completedAt: "2 hours ago",
        },
        {
            id: 2,
            carId: "#CAR-1221",
            carName: "Mahindra XUV",
            completedAt: "5 hours ago",
        },
        {
            id: 3,
            carId: "#CAR-1222",
            carName: "Tata Nexon",
            completedAt: "1 day ago",
        },
    ];

    return (
        <div className="space-y-4 sm:space-y-5">
            {/* Welcome Header - Modern Blue-Teal Theme */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-600 shadow-2xl border border-blue-400/30 p-5 sm:p-6 lg:p-7">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-400/10 rounded-full blur-3xl"></div>
                </div>
                
                <div className="relative z-10">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg border border-white/30">
                                    <Sparkles className="h-5 w-5 text-cyan-200" />
                                </div>
                                <Badge className="bg-white/20 backdrop-blur-md text-white border-white/30 text-xs font-bold px-3 py-1 shadow-lg">
                                    Inspector Dashboard
                                </Badge>
                            </div>
                            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-2 bg-gradient-to-r from-white via-cyan-100 to-white bg-clip-text text-transparent">
                                Welcome back! 👋
                            </h1>
                            <p className="text-blue-50 text-sm sm:text-base font-medium max-w-2xl">
                                Track your inspections and stay on top of your tasks with real-time updates
                            </p>
                        </div>
                        <div className="hidden lg:flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-md rounded-3xl border-2 border-white/30 shadow-2xl transform hover:scale-110 transition-transform duration-300">
                            <ClipboardCheck className="h-10 w-10 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards - Enhanced Grid */}
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                        Overview Statistics
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <OverviewStatCard
                            label="Total Assigned"
                            value={stats.totalAssigned}
                            icon={ClipboardCheck}
                            background="linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(99,102,241,1) 50%, rgba(37,99,235,1) 100%)"
                        />
                    </div>
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <OverviewStatCard
                            label="Completed"
                            value={stats.completed}
                            icon={CheckCircle2}
                            background="linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(16,185,129,1) 50%, rgba(22,163,74,1) 100%)"
                        />
                    </div>
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <OverviewStatCard
                            label="In Progress"
                            value={stats.inProgress}
                            icon={Clock}
                            background="linear-gradient(135deg, rgba(251,191,36,1) 0%, rgba(245,158,11,1) 50%, rgba(217,119,6,1) 100%)"
                        />
                    </div>
                    <div className="transform hover:scale-105 transition-transform duration-300">
                        <OverviewStatCard
                            label="Pending"
                            value={stats.pending}
                            icon={AlertCircle}
                            background="linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(220,38,38,1) 50%, rgba(185,28,28,1) 100%)"
                        />
                    </div>
                </div>
            </div>

            {/* Quick Actions - Enhanced Cards */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.12)] p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-1">
                            Quick Actions
                        </h2>
                        <p className="text-slate-600 text-xs sm:text-sm font-medium">
                            Access frequently used features instantly
                        </p>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {quickActions.map((action) => (
                        <div
                            key={action.id}
                            className="group relative overflow-hidden bg-white border-2 border-slate-200/60 rounded-2xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:border-blue-400"
                            onClick={() => router.push(action.route)}
                        >
                            {/* Gradient Overlay on Hover */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
                            
                            {/* Side Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${action.color} opacity-60 group-hover:opacity-100 transition-opacity duration-300`}></div>
                            
                            {/* Decorative Corner */}
                            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-bl-full transition-opacity duration-300`}></div>
                            
                            <div className="relative p-5">
                                <div className="flex items-start gap-3 mb-3">
                                    <div
                                        className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} text-white shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300 relative`}
                                    >
                                        {/* Glow Effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-xl blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-300`}></div>
                                        <action.icon className="h-6 w-6 relative z-10" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-700 transition-colors">
                                            {action.title}
                                        </h3>
                                        <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                                            {action.description}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center text-xs font-bold text-blue-600 group-hover:text-blue-700 transition-colors pt-3 border-t border-slate-200/60">
                                    Open Now
                                    <ArrowRight className="ml-2 h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Two Column Layout - Enhanced */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* Upcoming Tasks */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.12)] p-5 sm:p-6 relative overflow-hidden">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-100/50 to-cyan-100/30 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
                                        <Calendar className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                            Upcoming Tasks
                                        </h3>
                                        <p className="text-xs text-slate-600 font-medium">
                                            Inspections that need your attention
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {upcomingTasks.map((task, index) => (
                                <div
                                    key={task.id}
                                    className="group relative p-4 bg-gradient-to-br from-slate-50 to-white rounded-xl border-2 border-slate-200/60 hover:border-indigo-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                                    onClick={() => router.push("/inspector/carList")}
                                >
                                    {/* Priority Indicator Bar */}
                                    <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-xl ${
                                        task.priority === "high"
                                            ? "bg-gradient-to-b from-red-500 to-red-600"
                                            : task.priority === "medium"
                                                ? "bg-gradient-to-b from-yellow-500 to-orange-500"
                                                : "bg-gradient-to-b from-blue-500 to-indigo-500"
                                    }`}></div>
                                    
                                    <div className="flex items-start justify-between pl-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-700 transition-colors">
                                                    {task.carName}
                                                </p>
                                                <Badge
                                                    className={`text-xs px-2 py-0.5 font-bold border ${
                                                        task.priority === "high"
                                                            ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
                                                            : task.priority === "medium"
                                                                ? "bg-yellow-50 text-yellow-700 border-yellow-300 shadow-sm"
                                                                : "bg-blue-50 text-blue-700 border-blue-300 shadow-sm"
                                                    }`}
                                                >
                                                    {task.priority}
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2 font-medium">{task.carId}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                                <Clock className="h-3.5 w-3.5 text-indigo-600" />
                                                <span>Due: {task.dueDate}</span>
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs font-bold text-blue-600 hover:text-white hover:bg-blue-600 rounded-lg px-3 py-1.5 transition-all duration-300"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                router.push("/inspector/carList");
                                            }}
                                        >
                                            View
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Completions */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.12)] p-5 sm:p-6 relative overflow-hidden">
                    {/* Decorative Gradient */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-100/50 to-emerald-100/30 rounded-full blur-3xl"></div>
                    
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <div className="flex items-center gap-2.5 mb-2">
                                    <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                                        <CheckCircle2 className="h-4 w-4 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                            Recent Completions
                                        </h3>
                                        <p className="text-xs text-slate-600 font-medium">
                                            Your latest completed inspections
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {recentCompletions.map((item) => (
                                <div
                                    key={item.id}
                                    className="group relative p-4 bg-gradient-to-br from-green-50/80 to-emerald-50/50 rounded-xl border-2 border-green-200/60 hover:border-green-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    {/* Success Indicator Bar */}
                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-green-500 to-emerald-600 rounded-l-xl"></div>
                                    
                                    <div className="flex items-start justify-between pl-3">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1.5">
                                                <p className="text-sm font-bold text-slate-900">
                                                    {item.carName}
                                                </p>
                                                <Badge className="bg-green-100 text-green-700 border border-green-300 text-xs font-bold px-2 py-0.5 shadow-sm">
                                                    Done
                                                </Badge>
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2 font-medium">{item.carId}</p>
                                            <div className="flex items-center gap-1.5 text-xs text-slate-600 font-semibold">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                                                <span>Completed {item.completedAt}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Performance Summary - Enhanced */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl border-2 border-slate-200/60 shadow-[0_8px_30px_rgba(15,23,42,0.12)] p-5 sm:p-6 relative overflow-hidden">
                {/* Decorative Gradient */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-br from-blue-100/50 to-cyan-100/30 rounded-full blur-3xl"></div>
                
                <div className="relative z-10">
                    <div className="flex items-center justify-between mb-5">
                        <div>
                            <div className="flex items-center gap-2.5 mb-2">
                                <div className="p-2 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-lg">
                                    <TrendingUp className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-bold text-slate-900">
                                        This Week's Performance
                                    </h3>
                                    <p className="text-xs text-slate-600 font-medium">
                                        Your inspection activity summary
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="group relative p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200/60 hover:border-blue-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <ClipboardCheck className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">12</p>
                                    <p className="text-xs text-blue-700 font-bold mt-0.5">
                                        Inspections Done
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative p-4 bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl border-2 border-teal-200/60 hover:border-teal-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle2 className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">95%</p>
                                    <p className="text-xs text-teal-700 font-bold mt-0.5">
                                        Success Rate
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="group relative p-4 bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl border-2 border-cyan-200/60 hover:border-cyan-400 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-2xl font-extrabold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">2.5h</p>
                                    <p className="text-xs text-cyan-700 font-bold mt-0.5">
                                        Avg. Time
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InspectorDashboard;
