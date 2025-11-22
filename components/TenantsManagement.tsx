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
  Home,
  Calendar,
  Mail,
  MapPin
} from 'lucide-react';

const tenantsData = [
  {
    id: 1,
    name: "Emma Wilson",
    email: "emma.wilson@email.com",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    status: "Active",
    joinDate: "Dec 20, 2023",
    lastLogin: "1 week ago",
    property: "Sunset Apartments #304",
    rentAmount: "$1,200",
    leaseEnd: "Dec 2024"
  },
  {
    id: 2,
    name: "Maria Rodriguez",
    email: "maria.rodriguez@email.com",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    status: "Active",
    joinDate: "Feb 28, 2024",
    lastLogin: "3 hours ago",
    property: "Ocean View Tower #1205",
    rentAmount: "$1,800",
    leaseEnd: "Feb 2025"
  },
  {
    id: 3,
    name: "John Carter",
    email: "john.carter@email.com",
    avatar: "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg",
    status: "Pending",
    joinDate: "Mar 10, 2024",
    lastLogin: "Never",
    property: "Green Valley House #12",
    rentAmount: "$950",
    leaseEnd: "Mar 2025"
  },
  {
    id: 4,
    name: "Sarah Davis",
    email: "sarah.davis@email.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    status: "Active",
    joinDate: "Jan 15, 2024",
    lastLogin: "2 days ago",
    property: "City Center Loft #890",
    rentAmount: "$2,100",
    leaseEnd: "Jan 2025"
  }
];

export default function TenantsManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const statsData = [
    { title: "Total Tenants", value: 156, icon: Home },
    { title: "Active Leases", value: 142, icon: Calendar },
    { title: "Pending Applications", value: 14, icon: Mail },
    { title: "Avg. Rent", value: "$1,350", icon: UserPlus }
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

  const filteredTenants = tenantsData.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Tenants Management"
        actions={
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <UserPlus className="mr-2 w-4 h-4" />
            Add Tenant
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
        title="All Tenants"
        description="A list of all tenants in your platform."
        searchComponent={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search tenants..."
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
                <TableHead>Tenant</TableHead>
                <TableHead>Property</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>Lease End</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTenants.map((tenant) => (
                <TableRow key={tenant.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={tenant.avatar} alt={tenant.name} />
                        <AvatarFallback className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs">
                          {tenant.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{tenant.name}</p>
                        <p className="text-sm text-gray-600">{tenant.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{tenant.property}</span>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-green-600">{tenant.rentAmount}</TableCell>
                  <TableCell className="text-sm text-gray-600">{tenant.leaseEnd}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(tenant.status)}>
                      {tenant.status}
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