'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';

import { 
  User, 
  Crown,
  Calendar,
  CreditCard,
  LogOut,
  ChevronRight,
  BadgeCheck
} from 'lucide-react';

const portalLinks = [
  { 
    name: 'My Details', 
    href: '/member-portal/profile', 
    icon: User,
    description: 'Manage your profile information'
  },
  { 
    name: 'My Memberships', 
    href: '/member-portal/applications', 
    icon: Crown,
    description: 'View your membership status'
  },
  { 
    name: 'My Events', 
    href: '/member-portal/events', 
    icon: Calendar,
    description: 'Upcoming events and conferences'
  },
  { 
    name: 'My Payments', 
    href: '/member-portal/payments', 
    icon: CreditCard,
    description: 'Manage payments and billing'
  },
];

export default function MemberPortalLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        {/* <Header /> */}
        
        {/* Breadcrumbs */}
        <div className="bg-muted/30 border-b border-border pt-20">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
                Homepage
              </Link>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
              <span className="text-foreground font-medium">My Account</span>
            </nav>
          </div>
        </div>

        {/* Page Title */}
        <div className="bg-muted/30 border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-center">My Account</h1>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8 mb-16">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Left Sidebar */}
            <aside className="lg:w-80 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border shadow-sm">
                {/* User Info */}
                {user && (
                  <div className="p-6 border-b border-border">
                    <div className="flex items-center space-x-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-primary-foreground text-sm font-medium shadow-lg">
                        {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'M'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.user_metadata?.full_name || 'Member'}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {user.email}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          <span className="text-xs text-muted-foreground capitalize">{user.userRole}</span>
                          {user.user_metadata?.status === 'active' && (
                            <BadgeCheck className="h-3 w-3 ml-1 text-primary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation */}
                <div className="p-4">
                  <nav className="space-y-2">
                    {portalLinks.map((link) => {
                      const Icon = link.icon;
                      const isActive = pathname === link.href;
                      return (
                        <Link
                          key={link.name}
                          href={link.href}
                          className={`
                            group flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200
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
                  </nav>
                </div>

                {/* Logout */}
                <div className="p-4 border-t border-border">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Panel */}
            <main className="flex-1 min-w-0">
              <div className="bg-card rounded-lg border border-border shadow-sm">
                {children}
              </div>
            </main>
          </div>
        </div>
        
      </div>
    </ProtectedRoute>
  );
}
