"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/utils/api";
import { PublicMember, PublicMembersResponse } from "@/types";
import { handleApiError } from "@/utils/errorHandler";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import CommonBanner from "@/components/CommonBanner";
import MemberCard from "@/components/membership/MemberCard";
import Pagination from "@/components/ui/Pagination";
import { useDebounce } from "@/hooks/useDebounce";
import { Search, Filter } from "lucide-react";

const MemberDirectoryContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [members, setMembers] = useState<PublicMember[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "");

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const currentPage = parseInt(searchParams.get("page") || "1", 20);

  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      const params = new URLSearchParams();
      params.set("page", currentPage.toString());
      if (debouncedSearchTerm) {
        params.set("search", debouncedSearchTerm);
      }
      if (roleFilter) {
        params.set("role", roleFilter);
      }
      
      // Update URL without reloading
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.pushState({}, '', newUrl);

      try {
        const response = await api.get<PublicMembersResponse>(
          `/api/v1/membership/members/public?${params.toString()}`
        );
        setMembers(response.users || []);
        setTotalPages(response.pages || 1);
      } catch (err) {
        const errorMessage = handleApiError(err, router);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [currentPage, debouncedSearchTerm, roleFilter, router]);

  return (
    <div>
      <CommonBanner
        text="Member Directory"
        imageUrl="/assets/images/aboutus_hero.svg"
      />
      <div className="container mx-auto px-4 py-12 min-h-[70vh]">
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name, specialization, etc."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full md:w-auto pl-10 pr-4 py-2 border rounded-lg appearance-none focus:ring-primary focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="consultant">Consultant</option>
              <option value="trainee">Trainee</option>
            </select>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center min-h-[50vh] items-center">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 min-h-[50vh] flex items-center justify-center">{error}</div>
        ) : members.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {members.map((member) => (
                <MemberCard key={member.membershipId} member={member} />
              ))}
            </div>
            {totalPages >= 1 && <Pagination currentPage={currentPage} totalPages={totalPages} />}
          </>
        ) : (
          <div className="text-center text-gray-500 min-h-[50vh] flex items-center justify-center">
            No members found.
          </div>
        )}
      </div>
    </div>
  );
};

const MemberDirectoryPage = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <MemberDirectoryContent />
  </Suspense>
);

export default MemberDirectoryPage;
