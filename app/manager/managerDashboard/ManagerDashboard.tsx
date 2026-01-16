"use client";
import React from "react";
import { useRouter } from "next/navigation";
import {
  OverviewStatCard
} from '@/components/common';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/Button/Button';
import {
  Users,
  Car,
  ClipboardCheck,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
  Activity,
} from 'lucide-react';

const ManagerDashboard = () => {
  const router = useRouter();

  const stats = {
    totalInspectors: 12,
    assignedInspections: 8,
    totalCars: 45,
    pendingTasks: 5,
  };

  const recentActivities = [
    {
      id: 1,
      type: 'inspection',
      title: 'New inspection assigned',
      description: 'Car #1234 assigned to Rajesh Kumar',
      time: '2 hours ago',
      status: 'pending',
    },
    {
      id: 2,
      type: 'inspector',
      title: 'New inspector added',
      description: 'Priya Sharma joined your team',
      time: '5 hours ago',
      status: 'completed',
    },
    {
      id: 3,
      type: 'car',
      title: 'Car inspection completed',
      description: 'Car #5678 inspection completed by Amit Patel',
      time: '1 day ago',
      status: 'completed',
    },
    {
      id: 4,
      type: 'task',
      title: 'Pending verification',
      description: '3 inspector documents need verification',
      time: '2 days ago',
      status: 'pending',
    },
  ];

  const quickActions = [
    {
      id: 1,
      title: 'View Inspectors',
      description: 'Manage your inspector team',
      icon: Users,
      color: 'from-blue-500 to-indigo-600',
      route: '/manager/inspectorList',
    },
    {
      id: 2,
      title: 'View Cars',
      description: 'Browse all cars',
      icon: Car,
      color: 'from-green-500 to-emerald-600',
      route: '/manager/carList',
    },
    {
      id: 3,
      title: 'Assigned Inspections',
      description: 'Track inspection progress',
      icon: ClipboardCheck,
      color: 'from-purple-500 to-pink-600',
      route: '/manager/carList',
    },
  ];

  return (

    <div className="space-y-4 sm:space-y-6">

      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 shadow-2xl border border-blue-300/30 p-6 text-white">
        <div className="relative z-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                  <Sparkles className="h-5 w-5 text-yellow-300" />
                </div>
                <Badge className="bg-white/20 backdrop-blur-sm text-white border-white/30 text-xs font-semibold px-3 py-1">
                  Manager Dashboard
                </Badge>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white via-blue-50 to-white bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-blue-50 text-base sm:text-lg md:text-xl font-medium">
                Here's what's happening with your team today
              </p>
            </div>
            <div className="hidden sm:flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
              <Activity className="h-10 w-10 text-white/80" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards - Enhanced */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-lg sm:text-xl font-bold text-slate-700">Overview Statistics</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <OverviewStatCard
            label="Total Inspectors"
            value={stats.totalInspectors}
            icon={Users}
            background="linear-gradient(135deg, rgba(59,130,246,1) 0%, rgba(37,99,235,1) 50%, rgba(29,78,216,1) 100%)"
          />
          <OverviewStatCard
            label="Assigned Inspections"
            value={stats.assignedInspections}
            icon={ClipboardCheck}
            background="linear-gradient(135deg, rgba(34,197,94,1) 0%, rgba(22,163,74,1) 50%, rgba(21,128,61,1) 100%)"
          />
          <OverviewStatCard
            label="Total Cars"
            value={stats.totalCars}
            icon={Car}
            background="linear-gradient(135deg, rgba(168,85,247,1) 0%, rgba(147,51,234,1) 50%, rgba(126,34,206,1) 100%)"
          />
          <OverviewStatCard
            label="Pending Tasks"
            value={stats.pendingTasks}
            icon={Clock}
            background="linear-gradient(135deg, rgba(239,68,68,1) 0%, rgba(220,38,38,1) 50%, rgba(185,28,28,1) 100%)"
          />
        </div>
      </div>

      {/* Quick Actions - Enhanced */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-slate-200/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
                Quick Actions
              </h2>
            </div>
            <p className="text-slate-600 text-sm font-medium">
              Access frequently used features instantly
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {quickActions.map((action, index) => (
            <div
              key={action.id}
              className="group relative overflow-hidden bg-white border-2 border-slate-200/60 shadow-lg hover:shadow-2xl rounded-3xl cursor-pointer"
              onClick={() => router.push(action.route)}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5`} />

              {/* Decorative corner accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-10 rounded-bl-full`} />

              {/* Side accent bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b ${action.color} opacity-60 group-hover:opacity-100`} />

              <div className="relative p-6">
                {/* Icon and Content in Row */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Icon container */}
                  <div className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br ${action.color} text-white shadow-xl relative`}>
                    {/* Glow effect */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${action.color} rounded-2xl blur-xl opacity-0 group-hover:opacity-50`} />
                    <action.icon className="h-6 w-6 relative z-10" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-slate-800 leading-tight">
                      {action.title}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed group-hover:text-slate-700">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Action footer */}
                <div className="flex items-center pt-4 border-t border-slate-200/60 text-sm font-semibold text-primary-700 gap-2">
                  View Details
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity - Enhanced */}
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgba(15,23,42,0.12)] border border-slate-200/60 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                Recent Activity
              </h2>
            </div>
            <p className="text-slate-600 text-sm sm:text-base font-medium">
              Latest updates and notifications from your team
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl px-4 py-2 transition-all"
            onClick={() => router.push('/managerNotifications')}
          >
            View All
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-3">
          {recentActivities.map((activity, index) => (
            <div
              key={activity.id}
              className="group relative overflow-hidden bg-gradient-to-br from-white to-slate-50/30 border-2 border-slate-200/80 shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.01] rounded-2xl"
            >
              {/* Status indicator bar */}
              <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${activity.status === 'completed'
                ? 'bg-gradient-to-b from-green-500 to-emerald-600'
                : 'bg-gradient-to-b from-orange-500 to-amber-600'
                }`} />

              <div className="relative p-5 sm:p-6 pl-6">
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${activity.status === 'completed'
                    ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-700 border-2 border-green-200'
                    : 'bg-gradient-to-br from-orange-100 to-amber-100 text-orange-700 border-2 border-orange-200'
                    } group-hover:scale-110 transition-transform duration-300`}>
                    {activity.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <AlertCircle className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                        {activity.title}
                      </h3>
                      <Badge
                        className={`text-xs px-3 py-1 rounded-full font-semibold border-2 ${activity.status === 'completed'
                          ? 'bg-green-50 text-green-700 border-green-300 shadow-sm'
                          : 'bg-orange-50 text-orange-700 border-orange-300 shadow-sm'
                          }`}
                      >
                        {activity.status}
                      </Badge>
                    </div>
                    <p className="text-sm sm:text-base text-slate-600 mb-3 leading-relaxed">
                      {activity.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-500 font-medium">
                      <Clock className="h-4 w-4" />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Performance Overview - Enhanced */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* This Week's Summary */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.12)] rounded-3xl p-6 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-100/50 to-indigo-100/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    This Week's Summary
                  </h3>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Your team's performance metrics
                </p>
              </div>
              <div className="w-10 h-10 ml-2 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/50 rounded-2xl border border-blue-100/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-700">Inspections Completed</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">24</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50/80 to-emerald-50/50 rounded-2xl border border-green-100/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-700">Active Inspectors</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">10</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50/80 to-pink-50/50 rounded-2xl border border-purple-100/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 text-white flex items-center justify-center shadow-lg">
                    <Car className="h-5 w-5" />
                  </div>
                  <span className="text-sm sm:text-base font-semibold text-slate-700">Cars Processed</span>
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">18</span>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="bg-white/90 backdrop-blur-xl border-2 border-slate-200/80 shadow-[0_8px_30px_rgba(15,23,42,0.12)] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
          {/* Decorative gradient */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-orange-100/50 to-red-100/30 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Upcoming Tasks
                  </h3>
                </div>
                <p className="text-sm text-slate-600 font-medium">
                  Things that need your attention
                </p>
              </div>
              <div className="w-12 h-12 ml-2 rounded-2xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 flex items-center justify-center text-white shadow-xl">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-br from-orange-50 to-amber-50 border-2 border-orange-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm sm:text-base font-bold text-orange-900">Verify Inspector Documents</span>
                  <Badge className="bg-orange-100 text-orange-700 border-2 border-orange-300 text-xs font-semibold px-2.5 py-1 shadow-sm">High</Badge>
                </div>
                <p className="text-xs sm:text-sm text-orange-700 mb-3 font-medium">3 inspector documents pending verification</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm font-semibold border-2 border-orange-300 text-orange-700 hover:bg-orange-100 hover:border-orange-400 rounded-xl transition-all"
                  onClick={() => router.push('/manager/inspectorList')}
                >
                  Review Now
                </Button>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200/60 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                <div className="flex items-start justify-between mb-3">
                  <span className="text-sm sm:text-base font-bold text-blue-900">Assign New Inspection</span>
                  <Badge className="bg-blue-100 text-blue-700 border-2 border-blue-300 text-xs font-semibold px-2.5 py-1 shadow-sm">Medium</Badge>
                </div>
                <p className="text-xs sm:text-sm text-blue-700 mb-3 font-medium">5 new cars waiting for inspection assignment</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs sm:text-sm font-semibold border-2 border-blue-300 text-blue-700 hover:bg-blue-100 hover:border-blue-400 rounded-xl transition-all"
                  onClick={() => router.push('/manager/carList')}
                >
                  Assign Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;