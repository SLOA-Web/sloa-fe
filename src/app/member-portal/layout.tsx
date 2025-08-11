'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  LayoutDashboard, 
  User, 
  Settings, 
  FileText, 
  LogOut,
  ChevronRight,
  HelpCircle,
  Menu
} from 'lucide-react';

const portalLinks = [
  { 
    name: 'Dashboard', 
    href: '/member-portal', 
    icon: LayoutDashboard,
    description: 'Overview of your account'
  },
  { 
    name: 'Profile', 
    href: '/member-portal/profile', 
    icon: User,
    description: 'Manage your profile'
  },
  { 
    name: 'Applications', 
    href: '/member-portal/applications', 
    icon: FileText,
    description: 'View your applications'
  },
  { 
    name: 'Settings', 
    href: '/member-portal/settings', 
    icon: Settings,
    description: 'Account settings'
  },
];

const secondaryLinks = [
  { 
    name: 'Help & Support', 
    href: '/member-portal/help', 
    icon: HelpCircle,
    description: 'Get help and support'
  },
];

export default function MemberPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        sidebar
      `}>
        <div className="flex h-full flex-col">
          {/* User Info */}
          <div className="border-b p-4">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-blue-50 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.fullName || 'User'}
                </p>
                <p className="text-xs text-muted-foreground truncate">
                  {user?.email} 
                </p>
                <div className="flex items-center mt-1">
                  <div className="h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground ml-1">Active</span>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="sidebar-content">
            <div className="p-4">
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Main Navigation
                </h3>
                {portalLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                      <span className="flex-1">{link.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 space-y-1">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Tools
                </h3>
                {secondaryLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`
                        group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200
                        ${isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                        }
                      `}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-accent-foreground'}`} />
                      <span className="flex-1">{link.name}</span>
                      {isActive && <ChevronRight className="h-4 w-4" />}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="sidebar-footer">
            <div className="space-y-2">
              <button
                onClick={handleLogout}
                className="w-full nav-item text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-4 md:p-6">
            {/* Mobile Sidebar Toggle - Professional placement */}
            <div className="md:hidden mb-4">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="btn btn-ghost btn-sm"
              >
                <Menu className="h-4 w-4 mr-2" />
                Menu
              </button>
            </div>
            
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
