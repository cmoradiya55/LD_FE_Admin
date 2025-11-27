"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users,
  LogOut,
  ChevronLeft, 
  ChevronRight,
  Home,
  Building,
  ChevronDown,
  ChevronUp,
  User,
  Settings,
  Key,
  Building2,
  BadgeCheck,
  CarFront
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
  isMobileMenuOpen?: boolean;
  onCloseMobileMenu?: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'users',  label: 'Users',  icon: Users },
  { id: 'city', label: 'City', icon: Building2 },
  { id: 'inspectionCenter', label: 'Inspection Center', icon: BadgeCheck },
  { id: 'car', label: 'Car', icon: CarFront },
  { id: 'profile', label: 'Profile', icon: User },
  { 
    id: 'settings', 
    label: 'Settings', 
    icon: Settings,
    subItems: [
      { id: 'change-password', label: 'Change Password', icon: Key },
    ]
  },
];

export default function Sidebar({ 
  currentPage, 
  onPageChange, 
  collapsed, 
  onToggleCollapse,
  onLogout,
  isMobileMenuOpen = false,
  onCloseMobileMenu
}: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [activeIndicatorStyle, setActiveIndicatorStyle] = useState<{
    top: number;
    height: number;
    opacity: number;
  }>({ top: 0, height: 44, opacity: 0 });
  const [activePopup, setActivePopup] = useState<string | null>(null);
  
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number | null>(null);
  const popupRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const triggerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Memoize menu item lookups for better performance
  const menuItemMap = useMemo(() => {
    const map = new Map<string, typeof menuItems[0]>();
    menuItems.forEach(item => {
      map.set(item.id, item);
    });
    return map;
  }, []);

  // Optimized toggle expanded function
  const toggleExpanded = useCallback((itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  }, []);

  // Smooth active indicator update using requestAnimationFrame
  const updateActiveIndicator = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      if (!navRef.current || collapsed) {
        setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
        return;
      }

      const activeEl = navRef.current.querySelector(`[data-menu-id="${currentPage}"]`) as HTMLElement | null;

      if (activeEl) {
        const navRect = navRef.current.getBoundingClientRect();
        const elRect = activeEl.getBoundingClientRect();
        setActiveIndicatorStyle({
          top: elRect.top - navRect.top,
          height: elRect.height,
          opacity: 1,
        });
      } else {
        setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      }
    });
  }, [currentPage, collapsed]);

  // Update indicator smoothly when dependencies change
  useEffect(() => {
    updateActiveIndicator();
    
    // Also update after a short delay to handle DOM updates
    const timer = setTimeout(updateActiveIndicator, 100);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      clearTimeout(timer);
    };
  }, [updateActiveIndicator, expandedItems]);

  // Handle collapsed state and auto-expand logic
  useEffect(() => {
    if (collapsed) {
      setExpandedItems(new Set());
      setActiveIndicatorStyle(prev => ({ ...prev, opacity: 0 }));
      setActivePopup(null);
    } else {
      // Auto-expand parent items if any submenu item is active
      const newExpanded = new Set<string>();
      menuItems.forEach(item => {
        if (item.subItems?.some(sub => sub.id === currentPage)) {
          newExpanded.add(item.id);
        }
      });
      setExpandedItems(newExpanded);
    }
  }, [collapsed, currentPage]);

  useEffect(() => {
    if (!activePopup) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (!activePopup) return;
      const popupEl = popupRefs.current[activePopup];
      const triggerEl = triggerRefs.current[activePopup];
      if (
        popupEl?.contains(event.target as Node) ||
        triggerEl?.contains(event.target as Node)
      ) {
        return;
      }
      setActivePopup(null);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activePopup]);

  // Check if any submenu item is active for a parent (memoized)
  const isSubMenuActive = useCallback((parentId: string) => {
    const parent = menuItemMap.get(parentId);
    return parent?.subItems?.some(sub => sub.id === currentPage) || false;
  }, [currentPage, menuItemMap]);

  // Handle page change and close mobile menu
  const handlePageChange = useCallback((page: string) => {
    onPageChange(page);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  }, [onPageChange, onCloseMobileMenu]);

  // Handle menu item click with improved logic
  const handleMenuItemClick = useCallback((item: typeof menuItems[0]) => {
    const hasSubItems = item.subItems && item.subItems.length > 0;
    
    if (hasSubItems && collapsed) {
      setActivePopup(prev => (prev === item.id ? null : item.id));
      return;
    } else if (hasSubItems && !collapsed) {
      toggleExpanded(item.id);
    } else {
      handlePageChange(item.id);
      setActivePopup(null);
    }
  }, [collapsed, toggleExpanded, handlePageChange]);

  const handleSubItemClick = useCallback((subItemId: string) => {
    handlePageChange(subItemId);
    setActivePopup(null);
  }, [handlePageChange]);

  // Memoize hover handlers for better performance
  const handleMouseEnter = useCallback((itemId: string) => {
    setHoveredItem(itemId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredItem(null);
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onCloseMobileMenu}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-lg h-screen sticky top-0",
        // Mobile/Tablet: Drawer behavior
        "lg:relative fixed lg:translate-x-0 z-50",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        // Desktop: Collapsed state
        collapsed ? "lg:w-[85px]" : "w-64 lg:w-60"
      )}>
        {/* Logo Section */}
        <div className="border-b border-gray-200 h-16 sm:h-20 px-3 sm:px-4 flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Image
                src="/logo.webp"
                alt="Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain flex-shrink-0"
                priority
              />
              {!collapsed && (
                <div className="animate-in fade-in-0 slide-in-from-left-2 duration-200">
                  <h1 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">AdminPro</h1>
                </div>
              )}
            </div>
            
            {/* Collapse button - only on large screens */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleCollapse}
              className="hidden lg:flex p-1.5 mr-2 transition-colors"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </Button>
            
            {/* Close button - only on mobile/tablet */}
            {onCloseMobileMenu && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCloseMobileMenu}
                className="lg:hidden p-1.5 mr-2 transition-colors"
                aria-label="Close menu"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

      {/* Navigation */}
      <nav
        ref={navRef}
        className={cn(
          "flex-1 relative",
          collapsed ? "lg:p-3 p-2 space-y-1" : "p-2 sm:p-3 lg:p-4 space-y-1 sm:space-y-2 overflow-y-auto"
        )}
      >
        {/* Animated Selection Indicator - Only show when not collapsed and on large screens */}
        {!collapsed && (
          <div
            className="absolute bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg transition-all duration-300 ease-out pointer-events-none z-0 hidden lg:block"
            style={{
              left: '8px',
              width: 'calc(100% - 16px)',
              top: `${activeIndicatorStyle.top}px`,
              height: `${activeIndicatorStyle.height}px`,
              opacity: activeIndicatorStyle.opacity,
              transform: 'translateZ(0)', // GPU acceleration for smoother animation
            }}
          />
        )}
        
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          const isHovered = hoveredItem === item.id;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isExpanded = expandedItems.has(item.id);
          const isSubItemActive = isSubMenuActive(item.id);
          const showPopup = collapsed && hasSubItems && activePopup === item.id;

          return (
            <div
              key={item.id}
              className="menu-item-container relative"
              ref={(el) => {
                triggerRefs.current[item.id] = el;
              }}
            >
              {/* Main Menu Item */}
              <div className="relative">
                <Button
                  variant="ghost"
                  data-menu-id={item.id}
                  className={cn(
                    "w-full transition-all duration-200 group relative z-10 !bg-transparent !hover:bg-transparent flex items-center text-xs sm:text-sm",
                    collapsed ? "lg:h-12 h-10 px-1.5 justify-center" : "h-9 sm:h-10 lg:h-11 px-2 sm:px-3 lg:px-4 justify-start",
                    // Expanded: only the truly active main item turns white (large screens only)
                    !collapsed && isActive && "lg:text-white text-blue-600 lg:bg-transparent",
                    // Collapsed: highlight if main or any of its subitems are active (large screens only)
                    collapsed && (isActive || isSubItemActive) && "lg:bg-blue-600 lg:text-white lg:rounded-lg bg-blue-50 text-blue-600 rounded-md",
                    // Default state
                    !collapsed && !isActive && "text-gray-600 hover:text-gray-800 hover:bg-gray-50"
                  )}
                  onClick={() => {
                    handleMenuItemClick(item);
                    // Close mobile menu when clicking a menu item without subitems
                    if (!item.subItems && onCloseMobileMenu) {
                      onCloseMobileMenu();
                    }
                  }}
                  onMouseEnter={() => handleMouseEnter(item.id)}
                  onMouseLeave={handleMouseLeave}
                  aria-expanded={hasSubItems ? isExpanded : undefined}
                >
                  <Icon className={cn(
                    "transition-all duration-200",
                    collapsed ? "w-4 h-4 sm:w-5 sm:h-5 mx-auto" : "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3",
                    collapsed
                      ? (isActive || isSubItemActive) ? "text-blue-600" : "text-gray-600"
                      : isActive ? "lg:text-white text-blue-600" : "text-gray-600",
                    isHovered && !collapsed && !isActive && "scale-110"
                  )} />
                  
                  {!collapsed && (
                    <>
                      <span className="font-medium flex-1 text-left self-center">
                        {item.label}
                      </span>
                      {hasSubItems && (
                        <div className="ml-2 transition-transform duration-200 flex items-center">
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          ) : (
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          )}
                        </div>
                      )}
                    </>
                  )}
                </Button>

                {/* Tooltip for collapsed state */}
                {collapsed && hasSubItems && isHovered && !showPopup && (
                  <div className="absolute left-16 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in-0 duration-150">
                    Click to open menu
                  </div>
                )}

                {/* Popup for collapsed submenus */}
                {showPopup && (
                  <div
                    ref={(el) => {
                      popupRefs.current[item.id] = el;
                    }}
                    className="absolute left-16 top-1/2 -translate-y-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 w-48 py-2 space-y-1"
                  >
                    {item.subItems?.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = currentPage === subItem.id;

                      return (
                        <Button
                          key={subItem.id}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start h-9 px-4 text-sm !bg-transparent",
                            isSubActive
                              ? "text-blue-600 font-semibold bg-blue-50"
                              : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                          )}
                          onClick={() => handleSubItemClick(subItem.id)}
                        >
                          <SubIcon
                            className={cn(
                              "w-4 h-4 mr-3",
                              isSubActive ? "text-blue-600" : "text-gray-500"
                            )}
                          />
                          <span className="font-medium">
                            {subItem.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Sub Menu Items */}
              {hasSubItems && !collapsed && isExpanded && (
                <div className="submenu-container ml-4 sm:ml-6 mt-1 space-y-1 animate-in slide-in-from-top-2 fade-in-0 duration-200">
                  {item.subItems?.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = currentPage === subItem.id;
                    const isSubHovered = hoveredItem === subItem.id;

                    return (
                      <Button
                        key={subItem.id}
                        variant="ghost"
                        data-menu-id={subItem.id}
                        className={cn(
                          "w-full justify-start h-8 sm:h-9 transition-all duration-200 relative z-10 px-2 sm:px-3 lg:px-4 text-xs sm:text-sm group !bg-transparent",
                          isSubActive
                            ? "lg:text-white text-blue-600 font-semibold lg:bg-transparent bg-blue-50"
                            : "text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md"
                        )}
                        onClick={() => {
                          handlePageChange(subItem.id);
                          if (onCloseMobileMenu) {
                            onCloseMobileMenu();
                          }
                        }}
                        onMouseEnter={() => handleMouseEnter(subItem.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <SubIcon className={cn(
                          "w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 sm:mr-3 transition-all duration-200",
                          isSubActive ? "lg:text-white text-blue-600" : "text-gray-500 group-hover:text-gray-700",
                          isSubHovered && !isSubActive && "scale-110"
                        )} />
                        <span className="font-medium">
                          {subItem.label}
                        </span>
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-2 sm:p-3 lg:p-4 border-t border-gray-200">
        <Button
          variant="ghost"
          className={cn(
            "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 flex items-center text-xs sm:text-sm",
            collapsed ? "lg:h-10 h-9 px-1.5 justify-center" : "h-9 sm:h-10 lg:h-11 px-2 sm:px-3 lg:px-4 justify-start"
          )}
          onClick={() => {
            onLogout();
            if (onCloseMobileMenu) {
              onCloseMobileMenu();
            }
          }}
          onMouseEnter={() => handleMouseEnter('logout')}
          onMouseLeave={handleMouseLeave}
          aria-label="Logout"
        >
          <LogOut className={cn(
            "transition-all duration-200",
            collapsed ? "w-4 h-4 sm:w-5 sm:h-5 mx-auto" : "w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3",
            hoveredItem === 'logout' && "scale-110"
          )} />
          {!collapsed && (
            <span className="font-medium">
              Logout
            </span>
          )}
        </Button>
      </div>
    </div>
    </>
  );
}