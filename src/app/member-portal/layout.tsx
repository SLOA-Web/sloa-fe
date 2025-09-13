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
  BadgeCheck,
  Loader2,
  Camera,
  Trash2,
  Edit3
} from 'lucide-react';
import api from '@/utils/api';

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
  {
    name: 'Settings',
    href: '/member-portal/settings',
    icon: User,
    description: 'Account settings and preferences'
  }
];

export default function MemberPortalLayout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { logout, user, login } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = React.useState(false);
  const [uploadingImage, setUploadingImage] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);
  const [showEditMenu, setShowEditMenu] = React.useState(false);

  const profileImageUrl = user?.profile?.profileImage ?? null;

  const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];

    const ALLOWED = ['image/jpeg', 'image/png'];
    const MAX_MB = 5;
    const MAX_BYTES = MAX_MB * 1024 * 1024;
    if (!ALLOWED.includes(file.type)) {
      // Silently ignore invalid types for now; could add toast
      event.target.value = '';
      return;
    }
    if (file.size > MAX_BYTES) {
      event.target.value = '';
      return;
    }

    try {
      setUploadingImage(true);
      const fd = new FormData();
      fd.append('profileImage', file);
      await api.upload('/api/v1/upload/profile/me', fd) as {
        message: string;
        file: {
          url: string;
          path: string;
          originalSize: number;
          compressedSize: number;
          compressionRatio: string;
          metadata: Record<string, unknown>;
        };
        profileImage: string;
      };

      // The new API automatically updates the profile, so we just need to refresh auth context
      await login();
    } finally {
      setUploadingImage(false);
      event.target.value = '';
    }
  };

  const handleRemoveImage = async () => {
    try {
      setUploadingImage(true);
      // According to API schema, send empty string to clear image
      await api.updateMyProfileImage('');
      await login();
    } finally {
      setUploadingImage(false);
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      // In case navigation is blocked or fails, re-enable button
      setIsLoggingOut(false);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">

        {/* Main Content Area */}
        <div className="container mx-auto px-4 py-8 mb-16">
          <div className="flex flex-col lg:flex-row gap-8 mt-[10%]">
            {/* Left Sidebar */}
            <aside className="lg:w-96 flex-shrink-0">
              <div className="bg-card rounded-lg border border-border shadow-sm">
                {/* User Info */}
                {user && (
                  <div className="p-6 border-b border-border">
                    <div className="flex items-start gap-4">
                      <div>
                        <div
                          className={`h-24 w-24 rounded-full overflow-hidden border border-border bg-primary text-primary-foreground flex items-center justify-center ${uploadingImage ? 'opacity-70' : ''}`}
                        >
                          {profileImageUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profileImageUrl} alt="Profile" className="h-full w-full object-cover object-center object-top" />
                          ) : (
                            <span className="text-xl font-semibold">
                              {user.user_metadata?.full_name?.[0] || user.email?.[0] || 'M'}
                            </span>
                          )}
                        </div>
                        <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleImageChange} disabled={uploadingImage} />
                      </div>
                      <div className="flex-1 min-w-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {user.fullName || 'Unknown User'}
                        </p>
                        <div className="flex items-center mt-8">
                          <div className="h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                          <span className="text-xs text-muted-foreground capitalize">{user.userRole}</span>
                          {user.user_metadata?.status === 'active' && (
                            <BadgeCheck className="h-3 w-3 ml-1 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                      {/* Right aligned edit control */}
                      <div className="ml-auto relative">
                        <button
                          type="button"
                          onClick={() => setShowEditMenu((v) => !v)}
                          disabled={uploadingImage}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-border bg-background hover:bg-accent flex items-center gap-2 shadow-sm"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        {showEditMenu && (
                          <div className="absolute right-0 top-full mt-2 w-44 rounded-md border border-border bg-background shadow-md overflow-hidden z-10">
                            <button
                              type="button"
                              onClick={() => { setShowEditMenu(false); fileInputRef.current?.click(); }}
                              disabled={uploadingImage}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-accent flex items-center gap-2"
                            >
                              <Camera className="h-4 w-4" />
                              Change Photo
                            </button>
                            {profileImageUrl && (
                              <button
                                type="button"
                                onClick={async () => { setShowEditMenu(false); await handleRemoveImage(); }}
                                disabled={uploadingImage}
                                className="w-full px-3 py-2 text-left text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove Photo
                              </button>
                            )}
                          </div>
                        )}
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
                    disabled={isLoggingOut}
                    aria-busy={isLoggingOut}
                    className={`w-full flex items-center justify-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all
                    ${isLoggingOut 
                      ? 'bg-muted text-muted-foreground cursor-wait' 
                      : 'text-destructive hover:bg-destructive/10 active:scale-[0.98]'}
                    disabled:opacity-60`}
                  >
                    {isLoggingOut ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <LogOut className="h-4 w-4" />
                    )}
                    {isLoggingOut ? 'Signing out…' : 'Sign out'}
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content Panel */}
            <main className="flex-1 ">
              <div className="bg-card p-10 rounded-lg border border-border shadow-sm">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
