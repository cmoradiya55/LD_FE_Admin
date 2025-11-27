"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

type PaginationProps = {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    pageSize?: number;
    onPageSizeChange?: (size: number) => void;
    pageSizeOptions?: number[];
    className?: string;
};

const getVisiblePages = (current: number, total: number) => {
    if (total <= 5) {
        return Array.from({ length: total }, (_, index) => index + 1);
    }

    if (current <= 3) {
        return [1, 2, 3, 4, "...", total];
    }

    if (current >= total - 2) {
        return [1, "...", total - 3, total - 2, total - 1, total];
    }

    return [1, "...", current - 1, current, current + 1, "...", total];
};

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    pageSize,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
    className,
}: PaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    const items = getVisiblePages(currentPage, totalPages);

    return (
        <div
            className={cn(
                "flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-600 sm:flex-row sm:items-center sm:justify-between",
                className
            )}
        >
            <div className="flex flex-wrap items-center gap-2">
                <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(1)}
                >
                    <ChevronsLeft className="h-4 w-4" />
                </button>
                <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </button>

                <div className="flex items-center gap-1">
                    {items.map((item, index) =>
                        item === "..." ? (
                            <span key={`ellipsis-${index}`} className="px-2 text-xs text-slate-400">
                                ...
                            </span>
                        ) : (
                            <button
                                key={item}
                                className={cn(
                                    "h-8 w-8 rounded-full text-xs font-semibold transition",
                                    item === currentPage
                                        ? "bg-blue-600 text-white shadow"
                                        : "text-slate-600 bg-slate-100 hover:bg-slate-200"
                                )}
                                onClick={() => onPageChange(Number(item))}
                            >
                                {item}
                            </button>
                        )
                    )}
                </div>

                <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </button>
                <button
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:border-slate-300 disabled:cursor-not-allowed disabled:border-slate-100 disabled:text-slate-400"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(totalPages)}
                >
                    <ChevronsRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;