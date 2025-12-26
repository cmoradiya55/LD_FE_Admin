"use client";

import { ReactNode, useEffect, useMemo, useState } from "react";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Pagination from "./Pagination";

type Align = "left" | "center" | "right";

export type TableColumn<T extends Record<string, unknown>> = {
  id?: string;
  header: string;
  accessor?: keyof T;
  sortable?: boolean;
  align?: Align;
  className?: string;
  headerClassName?: string;
  render?: (row: T, rowIndex: number) => ReactNode;
};

interface TableProps<T extends Record<string, unknown>> {
  title?: string;
  description?: string;
  columns: TableColumn<T>[];
  data: T[];
  getRowId?: (row: T, rowIndex: number) => string | number;
  headerAction?: ReactNode;
  className?: string;
  rowClassName?: (row: T, rowIndex: number) => string | undefined;
  emptyMessage?: string;
  headerBackground?: string;
  enablePagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
}

const alignStyles: Record<Align, string> = {
  left: "text-left",
  center: "text-center",
  right: "text-right"
};

export function Table<T extends Record<string, unknown>>({
  title,
  description,
  columns,
  data,
  getRowId,
  headerAction,
  className,
  rowClassName,
  emptyMessage = "No data to display",
  headerBackground = "bg-gradient-to-r from-[#141f63] via-[#1c2d8f] to-[#2547c5]",
  enablePagination = false,
  pageSize = 5,
  pageSizeOptions
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(pageSize);
  const hasHeaderBackground = Boolean(headerBackground);
  const pageSizeChoices = pageSizeOptions ?? [5, 10, 20, 50];
  const allowPageSizeChange = pageSizeChoices.length > 0;

  useEffect(() => {
    setRowsPerPage(pageSize);
  }, [pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [data.length, rowsPerPage]);

  const totalPages = enablePagination ? Math.max(1, Math.ceil(data.length / rowsPerPage)) : 1;

  useEffect(() => {
    if (!enablePagination) {
      return;
    }

    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages, enablePagination]);

  const paginatedData = useMemo(() => {
    if (!enablePagination) {
      return data;
    }

    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage, rowsPerPage, enablePagination]);

  return (
    <section
      className={cn(
        "rounded-2xl border border-blue-100/80 bg-white shadow-[0px_15px_45px_rgba(15,23,66,0.08)] sm:rounded-3xl",
        className
      )}
    >
      {(title || description || headerAction) && (
        <div className="flex flex-col gap-4 border-b border-blue-100/70 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5">
          <div className="min-w-0 space-y-1">
            {title && (
              <h3 className="text-base font-semibold text-slate-900 sm:text-lg">
                {title}
              </h3>
            )}
            {description && (
              <p className="text-sm text-slate-500">{description}</p>
            )}
          </div>
          {headerAction && (
            <div className="flex w-full justify-start sm:w-auto sm:justify-end">
              {headerAction}
            </div>
          )}
        </div>
      )}

      <div className="w-full overflow-x-auto">
        <TableComponent className="min-w-[640px] text-xs sm:min-w-0 sm:text-sm">
          <TableHeader
            className={cn(
              hasHeaderBackground
                ? "text-white [&_tr]:border-0 [&_tr]:hover:bg-transparent"
                : "bg-transparent text-slate-500 [&_tr]:border-b [&_tr]:border-slate-100",
              headerBackground || undefined
            )}
          >
            <TableRow>
              {columns.map((column, index) => (
                <TableHead
                  key={column.id ?? column.header ?? index}
                  className={cn(
                    "px-3 py-3 text-[11px] font-semibold uppercase tracking-wide first:rounded-tl-2xl last:rounded-tr-2xl sm:px-5 sm:py-4 sm:text-xs sm:first:rounded-tl-3xl sm:last:rounded-tr-3xl",
                    hasHeaderBackground ? "text-white/90" : "text-slate-600",
                    alignStyles[column.align ?? "left"],
                    column.headerClassName
                  )}
                >
                  <span className="inline-flex items-center gap-1">
                    {column.header}
                    {column.sortable && (
                      <ArrowUpDown
                        className={cn(
                          "h-3.5 w-3.5",
                          hasHeaderBackground ? "text-white/70" : "text-slate-400"
                        )}
                      />
                    )}
                  </span>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody className="[&_tr:last-child]:border-0">
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="px-4 py-6 text-center text-xs text-slate-500 sm:px-6 sm:py-8 sm:text-sm"
                >
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}

            {paginatedData.map((row, rowIndex) => {
              const absoluteIndex = enablePagination
                ? (currentPage - 1) * rowsPerPage + rowIndex
                : rowIndex;

              return (
                <TableRow
                  key={String(getRowId ? getRowId(row, absoluteIndex) : absoluteIndex)}
                  className={cn(
                    "border-b border-slate-100/70 bg-white transition-colors hover:bg-blue-50/50",
                    rowClassName?.(row, absoluteIndex)
                  )}
                >
                  {columns.map((column, columnIndex) => {
                    const value =
                      column.accessor !== undefined
                        ? (row[column.accessor] as ReactNode)
                        : undefined;

                    return (
                      <TableCell
                        key={`${column.id ?? column.header}-${columnIndex}`}
                        className={cn(
                          "px-3 py-3 text-xs text-slate-700 sm:px-5 sm:py-4 sm:text-sm",
                          alignStyles[column.align ?? "left"],
                          column.className
                        )}
                      >
                        {column.render ? column.render(row, absoluteIndex) : value}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </TableComponent>
      </div>

      {enablePagination && data.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          pageSize={rowsPerPage}
          onPageSizeChange={allowPageSizeChange ? setRowsPerPage : undefined}
          pageSizeOptions={allowPageSizeChange ? pageSizeChoices : undefined}
        />
      )}
    </section>
  );
}

