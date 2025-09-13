"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import {
  ExternalLink,
  BookOpen,
  Download,
  Play,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { api } from "@/utils/api";
import { Resource } from "@/types";
import SearchFilterBar from "@/components/ui/SearchFilterBar";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const ResourcesPage = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [filteredResources, setFilteredResources] = useState<Resource[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLElement[]>([]);

  // Get unique categories from resources
  const categoryOptions = useMemo(() => {
    const categories = new Set<string>();
    resources.forEach((resource) => {
      if (resource.category) {
        categories.add(resource.category);
      }
    });
    return [
      { value: "all", label: "All Categories" },
      ...Array.from(categories)
        .sort()
        .map((category) => ({
          value: category,
          label: category,
        })),
    ];
  }, [resources]);

  const fetchResources = async () => {
    try {
      const data = await api.get("/api/v1/resources/");
      setResources(data as Resource[]);
      setFilteredResources(data as Resource[]);
    } catch (err: unknown) {
      console.error("Error fetching resources:", err);
      setError("Failed to fetch resources.");
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "documentation":
        return <BookOpen className="w-5 h-5" />;
      case "tutorial":
        return <Play className="w-5 h-5" />;
      case "guide":
        return <FileText className="w-5 h-5" />;
      case "library":
        return <Download className="w-5 h-5" />;
      default:
        return <LinkIcon className="w-5 h-5" />;
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    // Animate header only on mount/loading change, not on filteredResources change
    if (typeof window !== "undefined") {
      import("gsap").then(({ gsap }) => {
        if (!loading && headerRef.current) {
          gsap.fromTo(
            headerRef.current,
            { opacity: 0, y: -50 },
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
          );
        }
      });
    }
  }, [loading]);

  useEffect(() => {
    // Animate cards on filteredResources change
    if (typeof window !== "undefined") {
      import("gsap").then(({ gsap }) => {
        if (!loading && cardsRef.current.length > 0) {
          gsap.fromTo(
            cardsRef.current,
            { opacity: 0, y: 30, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.6,
              stagger: 0.1,
              ease: "power2.out",
              delay: 0.3,
            }
          );
        }
      });
    }
  }, [loading, filteredResources]);

  useEffect(() => {
    const filtered = resources.filter((resource) => {
      const matchesSearch =
        resource.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.shortDesc?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || resource.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredResources(filtered);
  }, [searchTerm, selectedCategory, resources]);

  const addToRefs = (el: HTMLElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Loading resources..." />;
  }

  return (
    <div ref={containerRef} className="min-h-screen py-24">
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div ref={headerRef} className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
            Resources Hub
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Discover curated resources to accelerate your development journey
          </p>
        </div>

        {/* Search and Filter Section */}
        <SearchFilterBar
          search={searchTerm}
          onSearchChange={setSearchTerm}
          selectedFilter={selectedCategory}
          onFilterChange={setSelectedCategory}
          filterOptions={categoryOptions}
          totalResults={filteredResources.length}
          searchPlaceholder="Search resources by name or description..."
          resultsLabel="resources found"
          searchLabel="Search Resources"
          filterLabel="Filter by Category"
          showFilter={false}
        />

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto">
              <p className="text-red-600 font-medium">{error}</p>
              <button
                onClick={fetchResources}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!error && filteredResources.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="bg-white/50 backdrop-blur-sm border border-slate-200 rounded-xl p-8 max-w-md mx-auto">
              <BookOpen className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                No resources found
              </h3>
              <p className="text-slate-500">
                {searchTerm
                  ? "Try adjusting your search or filter criteria"
                  : "No resources are available yet"}
              </p>
            </div>
          </div>
        )}

        {/* Resources Grid */}
        {!error && filteredResources.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredResources.map((resource) => (
              <a
                key={resource.id}
                href={resource.link}
                target="_blank"
                rel="noopener noreferrer"
                ref={addToRefs}
                className="group bg-white/70 backdrop-blur-sm rounded-xl border border-slate-200 p-6 hover:shadow-xl hover:shadow-primary-500/10 hover:border-primary-300 transition-all duration-300 hover:-translate-y-1 block cursor-pointer flex flex-col min-h-[200px]"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary-100 rounded-lg group-hover:bg-primary-200 transition-colors">
                      {getTypeIcon(resource.type)}
                    </div>
                    <div>
                      <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">
                        {resource.category}
                      </span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-primary-500 transition-colors ml-2" />
                </div>

                <h3 className="font-semibold text-slate-800 mb-2 group-hover:text-primary-600 transition-colors">
                  {resource.name}
                </h3>

                {resource.shortDesc && (
                  <p
                    className="text-sm text-slate-600 mb-3 overflow-hidden"
                    style={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}
                  >
                    {resource.shortDesc}
                  </p>
                )}

                <p className="text-xs text-slate-400 mb-4 capitalize">
                  {resource.type ? resource.type.replace("_", " ") : ""}
                </p>

                <div className="mt-auto">
                  <div className="inline-flex items-center space-x-2 text-primary-600 group-hover:text-primary-700 font-medium transition-colors">
                    <span>Explore Resource</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Stats Footer */}
        {!error && resources.length > 0 && (
          <div className="mt-12 text-center">
            <p className="text-slate-500">
              Showing {filteredResources.length} of {resources.length} resources
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourcesPage;
