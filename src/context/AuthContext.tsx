"use client";
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface UserIdentityData {
  email?: string;
  email_verified?: boolean;
  full_name?: string;
  location?: string;
  phone_verified?: boolean;
  role?: string;
  status?: string;
  sub?: string;
}

interface UserIdentity {
  identity_id?: string;
  id?: string;
  user_id?: string;
  identity_data?: UserIdentityData;
  provider?: string;
  last_sign_in_at?: string;
  created_at?: string;
  updated_at?: string;
  email?: string;
}

interface UserAppMetadata {
  provider?: string;
  providers?: string[];
}

interface User {
  id: string;
  userRole: string;
  email?: string;
  email_confirmed_at?: string;
  phone?: string;
  phoneNumber?: string | null;
  confirmation_sent_at?: string;
  confirmed_at?: string;
  recovery_sent_at?: string;
  last_sign_in_at?: string;
  app_metadata?: UserAppMetadata;
  user_metadata?: UserIdentityData;
  identities?: Array<UserIdentity>;
  created_at?: string;
  updated_at?: string;
  is_anonymous?: boolean;
  fullName?: string;
  role?: string;
  status?: string;
  location?: string;
  membershipId?: string;
  dateOfBirth?: string | null;
  profile?: {
    id?: string;
    nic?: string;
    specialization?: string;
    hospital?: string;
    cv?: string;
    profileImage?: string | null;
  };
}

interface AuthContextType {
  user: User | null;
  login: (userData?: User) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Get backend URL from environment
const BACKEND_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Always call backend /api/v1/auth/me on mount (refresh or first load)
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, { 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user as User);
          if (typeof window !== 'undefined') {
            localStorage.setItem("user_data", JSON.stringify(data.user));
          }
        } else {
          setUser(null);
          if (typeof window !== 'undefined') {
            localStorage.removeItem("user_data");
          }
        }
      } catch {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem("user_data");
        }
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // After a successful login API call, re-fetch /me to get the authoritative user
  const login = async (userData?: User) => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/me`, { 
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user as User);
        if (typeof window !== 'undefined') {
          localStorage.setItem("user_data", JSON.stringify(data.user));
        }
      } else if (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem("user_data", JSON.stringify(userData));
        }
      }
    } catch {
      if (userData) {
        setUser(userData);
        if (typeof window !== 'undefined') {
          localStorage.setItem("user_data", JSON.stringify(userData));
        }
      }
    }
  };

  const logout = async () => {
    try {
      const url = `${BACKEND_URL}/api/v1/auth/logout`;
      // Prefer sendBeacon for fire-and-forget without blocking navigation
      if (typeof navigator !== 'undefined' && 'sendBeacon' in navigator) {
        const blob = new Blob([], { type: 'application/octet-stream' });
        navigator.sendBeacon(url, blob);
      } else {
        // No body and no JSON headers to avoid CORS preflight
        fetch(url, {
          method: 'POST',
          credentials: 'include',
          keepalive: true,
        }).catch(() => { /* ignore */ });
      }
    } finally {
      // Optimistically clear local state
      setUser(null);
      if (typeof window !== 'undefined') {
        localStorage.removeItem("user_data");
      }
      // Small UX delay so spinner is visible
      await new Promise((r) => setTimeout(r, 300));
      router.push("/");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
