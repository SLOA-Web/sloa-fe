"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const MemberPortalPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the profile page (My Details page)
    router.replace("/member-portal/profile");
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to My Details...</p>
      </div>
    </div>
  );
};

export default MemberPortalPage;
