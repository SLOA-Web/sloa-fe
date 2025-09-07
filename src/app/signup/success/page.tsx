"use client";
import React from 'react';
import Link from 'next/link';
import { Mail, CheckCircle, ArrowRight } from 'lucide-react';
import AuthRedirect from '@/components/AuthRedirect';

const SignupSuccessPage = () => {
  return (
    <AuthRedirect>
      <div className="min-h-screen w-full flex items-center justify-center bg-[#FBFBFB] p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
        <div className="relative z-10 w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-foreground">Account Created Successfully!</h1>
            <p className="text-muted-foreground">
              Welcome to the Sri Lanka Orthopaedic Association
            </p>
          </div>

          {/* Success Message */}
          <div className="bg-white p-8 border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="text-center space-y-6">
              <div className="flex justify-center">
                <Mail className="w-12 h-12 text-primary" />
              </div>

              <div className="space-y-3">
                <h2 className="text-lg font-semibold text-foreground">
                  Check Your Email
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We&apos;ve sent a confirmation link to your email address. Please check your inbox (and spam folder) and click the link to activate your account.
                </p>
                <p className="text-xs text-muted-foreground">
                  Didn&apos;t receive the email? Check your spam folder or contact support.
                </p>
              </div>

              <div className="pt-4 space-y-3">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2.5 px-4 rounded-md hover:bg-primary/90 transition-all"
                >
                  <span>Continue to Login</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <p className="text-xs text-muted-foreground">
                  Already confirmed your account?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-primary hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthRedirect>
  );
};

export default SignupSuccessPage;
