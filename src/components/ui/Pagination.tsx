"use client";
import React from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination = ({ currentPage, totalPages }: PaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    const initialStartPage = Math.max(
      1,
      currentPage - Math.floor(maxPagesToShow / 2)
    );
    const initialEndPage = Math.min(
      totalPages,
      initialStartPage + maxPagesToShow - 1
    );

    const startPage =
      initialEndPage - initialStartPage + 1 < maxPagesToShow
        ? Math.max(1, initialEndPage - maxPagesToShow + 1)
        : initialStartPage;
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`mx-1 px-4 py-2 rounded-md text-sm font-medium ${
            currentPage === i
              ? "bg-primary text-primary-foreground"
              : "bg-card hover:bg-accent"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center mt-8">
      <button
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
      >
        <ChevronLeft size={20} />
      </button>
      {renderPageNumbers()}
      <button
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-md hover:bg-accent disabled:opacity-50"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
};

export default Pagination;
