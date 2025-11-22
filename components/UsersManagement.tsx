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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatCard, PageHeader, DataTableWrapper } from '@/components/common';
import { 
  Search, 
  UserPlus, 
  Filter, 
  Download,
  MoreHorizontal,
  Home,
  Building,
  Shield,
  Users as UsersIcon,
  Calendar,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

// Sample data for different user types
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
  }
];

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
  }
];

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
  }
];

export default function UsersManagement() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('tenants');

  const getStatsForTab = (tab: string) => {
    switch (tab) {
      case 'tenants':
        return [
          { title: "Total Tenants", value: 156, icon: Home },
          { title: "Active Leases", value: 142, icon: Calendar },
          { title: "Pending Applications", value: 14, icon: Mail },
          { title: "Avg. Rent", value: "$1,350", icon: UsersIcon }
        ];
      case 'landlords':
        return [
          { title: "Total Landlords", value: 45, icon: Building },
          { title: "Active Properties", value: 234, icon: Home },
          { title: "Total Revenue", value: "$156k", icon: Mail },
          { title: "Avg. Occupancy", value: "92%", icon: UsersIcon }
        ];
      case 'staff':
        return [
          { title: "Total Staff", value: 28, icon: Shield },
          { title: "Active Members", value: 26, icon: UsersIcon },
          { title: "Departments", value: 6, icon: Building },
          { title: "Full Access", value: 12, icon: Mail }
        ];
      default:
        return [];
    }
  };

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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTenantsTable = () => {
    const filteredTenants = tenantsData.filter(tenant =>
      tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tenant.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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
    );
  };

  const renderLandlordsTable = () => {
    const filteredLandlords = landlordsData.filter(landlord =>
      landlord.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      landlord.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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
    );
  };

  const renderStaffTable = () => {
    const filteredStaff = staffData.filter(staff =>
      staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
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
    );
  };

  const getTabContent = () => {
    switch (activeTab) {
      case 'tenants':
        return renderTenantsTable();
      case 'landlords':
        return renderLandlordsTable();
      case 'staff':
        return renderStaffTable();
      default:
        return renderTenantsTable();
    }
  };

  const getAddButtonText = () => {
    switch (activeTab) {
      case 'tenants':
        return 'Add Tenant';
      case 'landlords':
        return 'Add Landlord';
      case 'staff':
        return 'Add Staff Member';
      default:
        return 'Add User';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Users Management"
        description="Manage tenants, landlords, and staff members in your platform."
        actions={
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <UserPlus className="mr-2 w-4 h-4" />
            {getAddButtonText()}
          </Button>
        }
      />

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-96">
          <TabsTrigger value="tenants" className="flex items-center space-x-2">
            <Home className="w-4 h-4" />
            <span>Tenants</span>
          </TabsTrigger>
          <TabsTrigger value="landlords" className="flex items-center space-x-2">
            <Building className="w-4 h-4" />
            <span>Landlords</span>
          </TabsTrigger>
          <TabsTrigger value="staff" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Staff</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {getStatsForTab(activeTab).map((stat, index) => (
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
            title={`All ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
            description={`A list of all ${activeTab} in your platform.`}
            searchComponent={
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder={`Search ${activeTab}...`}
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
              {getTabContent()}
            </div>
          </DataTableWrapper>
        </TabsContent>
      </Tabs>
    </div>
  );
}