"use client";

import { useRouter } from 'next/navigation';
import { LoadingSpinner, PageHeader } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Palette, 
  Database, 
  Users, 
  Lock,
  ChevronRight,
  Globe,
  Mail,
  Smartphone
} from 'lucide-react';

export default function SettingsPage() {
  const router = useRouter();

  const settingsCategories = [
    {
      title: "General",
      description: "Basic application settings and preferences",
      icon: SettingsIcon,
      items: [
        { name: "Application Settings", description: "General app configuration", badge: null },
        { name: "Language & Region", description: "Set your language and timezone", badge: "EN" },
        { name: "Date & Time Format", description: "Customize date and time display", badge: null }
      ]
    },
    {
      title: "Security & Privacy",
      description: "Manage your security settings and privacy preferences",
      icon: Shield,
      items: [
        { name: "Password & Authentication", description: "Change password and setup 2FA", badge: "2FA Off" },
        { name: "Login Sessions", description: "Manage active sessions", badge: "3 Active" },
        { name: "Privacy Settings", description: "Control data sharing and privacy", badge: null }
      ]
    },
    {
      title: "Notifications",
      description: "Configure notification preferences",
      icon: Bell,
      items: [
        { name: "Email Notifications", description: "Configure email alerts", badge: "On" },
        { name: "Push Notifications", description: "Mobile and browser notifications", badge: "Off" },
        { name: "Notification Frequency", description: "How often you receive updates", badge: "Daily" }
      ]
    },
    {
      title: "Appearance",
      description: "Customize the look and feel of your dashboard",
      icon: Palette,
      items: [
        { name: "Theme Settings", description: "Light, dark, or auto theme", badge: "Auto" },
        { name: "Layout Preferences", description: "Sidebar and layout options", badge: null },
        { name: "Color Scheme", description: "Accent colors and branding", badge: "Blue" }
      ]
    },
    {
      title: "User Management",
      description: "Settings for managing users and permissions",
      icon: Users,
      items: [
        { name: "User Roles & Permissions", description: "Configure user access levels", badge: null },
        { name: "Invitation Settings", description: "How new users are invited", badge: null },
        { name: "User Registration", description: "Public registration settings", badge: "Disabled" }
      ]
    },
    {
      title: "System & Integration",
      description: "System settings and third-party integrations",
      icon: Database,
      items: [
        { name: "API Configuration", description: "API keys and webhooks", badge: "3 Keys" },
        { name: "Backup Settings", description: "Data backup configuration", badge: "Weekly" },
        { name: "Integration Settings", description: "Third-party service connections", badge: "5 Connected" }
      ]
    }
  ];

  const handleSettingClick = (categoryTitle: string, itemName: string) => {
    if (itemName === "Password & Authentication") {
      router.push('/settings/change-password');
    } else {
      // For now, just show that these are placeholders
      console.log(`Navigate to: ${categoryTitle} -> ${itemName}`);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application settings, preferences, and configurations."
        actions={
          <Button variant="outline">
            <Database className="mr-2 w-4 h-4" />
            Export Settings
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {settingsCategories.map((category, categoryIndex) => (
          <Card key={categoryIndex} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <category.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  <CardDescription className="text-sm">{category.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex}>
                  <div 
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                    onClick={() => handleSettingClick(category.title, item.name)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{item.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-gray-400 ml-3" />
                  </div>
                  {itemIndex < category.items.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lock className="w-5 h-5 text-red-600" />
            <span>Quick Actions</span>
          </CardTitle>
          <CardDescription>
            Common administrative tasks and security actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
              onClick={() => router.push('/settings/change-password')}
            >
              <Lock className="w-5 h-5 text-blue-600" />
              <span className="text-sm">Change Password</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Globe className="w-5 h-5 text-green-600" />
              <span className="text-sm">Domain Settings</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Mail className="w-5 h-5 text-purple-600" />
              <span className="text-sm">Email Config</span>
            </Button>
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center space-y-2"
            >
              <Smartphone className="w-5 h-5 text-orange-600" />
              <span className="text-sm">Mobile App</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}