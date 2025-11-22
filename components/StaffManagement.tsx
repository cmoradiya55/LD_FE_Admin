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
  Shield,
  Users,
  Building,
  Mail
} from 'lucide-react';

const staffData = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    avatar: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
    status: "Active",
    joinDate: "Jan 15, 2024",
    lastLogin: "2 hours ago",
    role: "Property Manager",
    department: "Operations",
    permissions: "Full Access"
  },
  {
    id: 2,
    name: "David Brown",
    email: "david.brown@email.com",
    avatar: "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg",
    status: "Active",
    joinDate: "Mar 8, 2024",
    lastLogin: "5 minutes ago",
    role: "Maintenance Supervisor",
    department: "Maintenance",
    permissions: "Limited Access"
  },
  {
    id: 3,
    name: "John Smith",
    email: "john.smith@email.com",
    avatar: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg",
    status: "Active",
    joinDate: "Nov 10, 2023",
    lastLogin: "30 minutes ago",
    role: "Admin",
    department: "IT",
    permissions: "Full Access"
  },
  {
    id: 4,
    name: "Alice Cooper",
    email: "alice.cooper@email.com",
    avatar: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg",
    status: "Active",
    joinDate: "Feb 20, 2024",
    lastLogin: "1 hour ago",
    role: "HR Manager",
    department: "Human Resources",
    permissions: "Limited Access"
  }
];

export default function StaffManagement() {
  const [searchQuery, setSearchQuery] = useState('');

  const statsData = [
    { title: "Total Staff", value: 28, icon: Shield },
    { title: "Active Members", value: 26, icon: Users },
    { title: "Departments", value: 6, icon: Building },
    { title: "Full Access", value: 12, icon: Mail }
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

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'property manager':
      case 'maintenance supervisor':
        return 'bg-blue-100 text-blue-800';
      case 'hr manager':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredStaff = staffData.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Staff Management"
        actions={
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <UserPlus className="mr-2 w-4 h-4" />
            Add Staff Member
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
        title="All Staff Members"
        description="A list of all staff members in your organization."
        searchComponent={
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search staff..."
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
                <TableHead>Staff Member</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Permissions</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStaff.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <input type="checkbox" className="rounded border-gray-300" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={staff.avatar} alt={staff.name} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-600 to-purple-700 text-white text-xs">
                          {staff.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-gray-900">{staff.name}</p>
                        <p className="text-sm text-gray-600">{staff.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRoleColor(staff.role)}>
                      {staff.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-600">{staff.department}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{staff.permissions}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(staff.status)}>
                      {staff.status}
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