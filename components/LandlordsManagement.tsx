"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatCard, PageHeader, DataTableWrapper } from '@/components/common';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download,
  MoreHorizontal,
  Building,
  Home,
  Mail
} from 'lucide-react';

const landlordsData = [
  {
    id: 1,
    name: "Mike Chen",
    email: "mike.chen@email.com",
    avatar: "https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg",
    status: "Active",
    joinDate: "Feb 3, 2024",
    lastLogin: "1 day ago",
    properties: 5,
    totalRevenue: "$8,500",
    occupancyRate: "95%"
  },
  {
    id: 2,
    name: "Robert Johnson",
    email: "robert.johnson@email.com",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
    status: "Active",
    joinDate: "Jan 5, 2024",
    lastLogin: "1 hour ago",
    properties: 12,
    totalRevenue: "$18,200",
    occupancyRate: "87%"
  },
  {
    id: 3,
    name: "Lisa Thompson",
    email: "lisa.thompson@email.com",
    avatar: "https://images.pexels.com/photos/712513/pexels-photo-712513.jpeg",
    status: "Active",
    joinDate: "Nov 15, 2023",
    lastLogin: "2 hours ago",
    properties: 8,
    totalRevenue: "$12,800",
    occupancyRate: "100%"
  },
  {
    id: 4,
    name: "David Wilson",
    email: "david.wilson@email.com",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    status: "Active",
    joinDate: "Dec 8, 2023",
    lastLogin: "4 hours ago",
    properties: 3,
    totalRevenue: "$4,200",
    occupancyRate: "92%"
  }
];

export default function LandlordsManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const statsData = [
    { title: "Total Landlords", value: 45, icon: Building },
    { title: "Active Properties", value: 234, icon: Home },
    { title: "Total Revenue", value: "$156k", icon: Mail },
    { title: "Avg. Occupancy", value: "92%", icon: UserPlus }
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredLandlords = landlordsData.filter(landlord =>
    landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    landlord.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Landlords Management"
        actions={
          <Button className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <UserPlus className="mr-2 w-4 h-4" />
            Add Landlord
          </Button>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsData.map((stat, index) => (
          <StatCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* Data Table */}
      <DataTableWrapper
        title="All Landlords"
        description="A list of all property owners in your platform."
        searchComponent={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search landlords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64 h-9"
            />
          </div>
        }
        actions={
          <>
            <Button variant="outline" size="sm" className="h-9">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="h-9">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </>
        }
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded border-gray-300" />
                </TableHead>
                <TableHead>Landlord</TableHead>
                <TableHead>Properties</TableHead>
                <TableHead>Monthly Revenue</TableHead>
                <TableHead>Occupancy Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLandlords.map((landlord) => (
                <TableRow key={landlord.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={landlord.avatar} alt={landlord.name} />
                        <AvatarFallback className="bg-gradient-to-r from-green-600 to-green-700 text-white text-xs">
                          {landlord.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{landlord.name}</p>
                        <p className="text-sm text-gray-600">{landlord.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Building className="w-4 h-4 text-gray-400" />
                      <span className="font-medium">{landlord.properties} properties</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">{landlord.totalRevenue}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-sm font-medium">{landlord.occupancyRate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(landlord.status)}>
                      {landlord.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DataTableWrapper>
    </div>
  );
}