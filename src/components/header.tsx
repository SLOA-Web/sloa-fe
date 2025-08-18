'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { 
  Menu, 
  X, 
  User, 
  LogOut, 
  Settings, 
  ChevronDown,
  Bell,
  Search,
  Home,
  FileText,
  Users,
  LayoutDashboard
} from 'lucide-react';

const Header = () => {
  const { user, logout, isLoading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <span className="text-lg font-bold">S</span>
            </div>
            <span className="text-xl font-bold text-foreground">SLOA</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            href="/" 
            className="nav-item text-sm font-medium transition-colors hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Home
          </Link>
          <Link 
            href="/apply" 
            className="nav-item text-sm font-medium transition-colors hover:text-foreground"
          >
            <FileText className="h-4 w-4" />
            Apply
          </Link>
        </nav>

        {/* Right side - Search, Notifications, User */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden sm:flex relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search..."
              className="input pl-9 w-64"
            />
          </div>

          {/* Notifications */}
          <button className="btn btn-ghost btn-sm relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-destructive"></span>
          </button>

          {/* User Menu */}
          {!isLoading && (
            <>
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="btn btn-ghost btn-sm flex items-center space-x-2"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center">
                      <User className="h-4 w-4 text-primary" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium">
                      {user.fullName || user.email || 'User'}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md border bg-background shadow-lg animate-in slide-in-from-top">
                      <div className="p-2">
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Signed in as
                        </div>
                        <div className="px-3 py-1 text-sm font-medium">
                          {user.email || user.id || 'User'}
                        </div>
                        <div className="mt-2 border-t pt-2">
                          <Link
                            href="/member-portal"
                            className="nav-item w-full"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <LayoutDashboard className="h-4 w-4" />
                            Dashboard
                          </Link>
                          <Link
                            href="/member-portal/profile"
                            className="nav-item w-full"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <User className="h-4 w-4" />
                            Profile
                          </Link>
                          <Link
                            href="/member-portal/settings"
                            className="nav-item w-full"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            <Settings className="h-4 w-4" />
                            Settings
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="nav-item w-full text-destructive hover:text-destructive"
                          >
                            <LogOut className="h-4 w-4" />
                            Sign out
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link href="/login" className="btn btn-outline btn-sm">
                    Sign in
                  </Link>
                  <Link href="/signup" className="btn btn-primary btn-sm">
                    Sign up
                  </Link>
                </div>
              )}
            </>
          )}

          {/* Loading state */}
          {isLoading && (
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="btn btn-ghost btn-sm md:hidden"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t bg-background animate-in slide-in-from-top">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                className="input pl-9 w-full"
              />
            </div>
            <nav className="flex flex-col space-y-2">
              <Link 
                href="/" 
                className="nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link 
                href="/apply" 
                className="nav-item"
                onClick={() => setIsMenuOpen(false)}
              >
                <FileText className="h-4 w-4" />
                Apply
              </Link>
            </nav>
            {!isLoading && !user && (
              <div className="flex flex-col space-y-2 pt-4 border-t">
                <Link 
                  href="/login" 
                  className="btn btn-outline w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign in
                </Link>
                <Link 
                  href="/signup" 
                  className="btn btn-primary w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
