"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatCard, PageHeader } from '@/components/common';
import { 
  Users, 
  TrendingUp, 
  DollarSign, 
  ShoppingCart,
  MoreHorizontal
} from 'lucide-react';

const statsData = [
  {
    title: "Total Users",
    value: "12,543",
    icon: Users,
    trend: {
      value: "+2.5%",
      type: "up" as const,
      label: "vs last month"
    }
  },
  {
    title: "Revenue",
    value: "$45,231",
    icon: DollarSign,
    trend: {
      value: "+12.3%",
      type: "up" as const,
      label: "vs last month"
    }
  },
  {
    title: "Orders",
    value: "3,241",
    icon: ShoppingCart,
    trend: {
      value: "-1.2%",
      type: "down" as const,
      label: "vs last month"
    }
  },
  {
    title: "Growth Rate",
    value: "23.1%",
    icon: TrendingUp,
    trend: {
      value: "+4.2%",
      type: "up" as const,
      label: "vs last month"
    }
  }
];

const recentActivity = [
  {
    id: 1,
    action: "New user registered",
    user: "Sarah Johnson",
    time: "2 minutes ago",
    status: "success"
  },
  {
    id: 2,
    action: "Payment processed",
    user: "Mike Chen",
    time: "5 minutes ago",
    status: "success"
  },
  {
    id: 3,
    action: "Order cancelled",
    user: "Emma Wilson",
    time: "10 minutes ago",
    status: "warning"
  },
  {
    id: 4,
    action: "Support ticket created",
    user: "David Brown",
    time: "15 minutes ago",
    status: "info"
  }
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        actions={
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <TrendingUp className="mr-2 w-4 h-4" />
            Generate Report
          </Button>
        }
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend}
          />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-md border-0">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                <CardDescription>Latest updates from your platform</CardDescription>
              </div>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">by {activity.user}</p>
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            <CardDescription>Frequently used functions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start h-11 hover:bg-gray-50 transition-colors">
              <Users className="mr-3 w-4 h-4" />
              Add New User
            </Button>
            <Button variant="outline" className="w-full justify-start h-11 hover:bg-gray-50 transition-colors">
              <ShoppingCart className="mr-3 w-4 h-4" />
              Create Order
            </Button>
            <Button variant="outline" className="w-full justify-start h-11 hover:bg-gray-50 transition-colors">
              <TrendingUp className="mr-3 w-4 h-4" />
              View Analytics
            </Button>
            <Button variant="outline" className="w-full justify-start h-11 hover:bg-gray-50 transition-colors">
              <DollarSign className="mr-3 w-4 h-4" />
              Process Payment
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}