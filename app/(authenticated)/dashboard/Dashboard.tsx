"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PageHeader,
  OverviewStatCard,
  OverviewSummaryCard,
  Table,
  type TableColumn,
} from "@/components/common";
import {
  AlertCircle,
  CheckCircle,
  Eye,
  MoreHorizontal,
  TrendingUp,
  XCircle,
} from "lucide-react";
import {
  CarRentalRow,
  PendingCarRow,
  carBrandLogos,
  carsOnRentData,
  carsOverviewStats,
  driverOverviewStats,
  pendingCarsData,
  vendorOverviewStats,
} from "./data";


const carsOnRentColumns: TableColumn<CarRentalRow>[] = [
  {
    id: "driver",
    header: "Driver's name",
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 border border-white shadow-sm ring-2 ring-blue-50">
          {row.driver.avatar && (
            <AvatarImage src={row.driver.avatar} alt={row.driver.name} />
          )}
          <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
            {row.driver.initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-semibold text-slate-900">{row.driver.name}</p>
          <p className="text-xs text-slate-500">{row.driver.location}</p>
        </div>
      </div>
    )
  },
  {
    id: "car",
    header: "Car",
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold uppercase text-white ${row.car.accent}`}
        >
          {row.car.badge}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{row.car.name}</p>
          <Badge className="mt-1 rounded-full bg-blue-50/60 px-2 py-0.5 text-[11px] font-medium text-blue-600" variant="outline">
            {row.car.type}
          </Badge>
        </div>
      </div>
    )
  },
  {
    id: "vendor",
    header: "Vendor",
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-700">
          <AvatarFallback>{row.vendor.initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-slate-900">{row.vendor.name}</p>
      </div>
    )
  },
  {
    id: "start",
    header: "Start",
    accessor: "start",
    className: "text-sm font-medium text-slate-900"
  },
  {
    id: "finish",
    header: "Finish",
    accessor: "finish",
    className: "text-sm font-medium text-slate-900"
  },
  {
    id: "price",
    header: "Price",
    accessor: "price",
    align: "right",
    className: "text-sm font-semibold text-slate-900"
  },
  {
    id: "countdown",
    header: "Countdown",
    accessor: "countdown",
    align: "right",
    className: "font-mono text-sm font-semibold text-slate-900"
  },
  {
    id: "actions",
    header: "Details",
    align: "right",
    render: (row: any) => (
      <div className="flex items-center justify-end gap-2">
        {row.status === "alert" && (
          <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-600">
            <AlertCircle className="h-3.5 w-3.5" />
            Issue
          </span>
        )}
        <button className="text-sm font-semibold text-blue-600 transition hover:text-blue-700">
          Details
        </button>
      </div>
    )
  }
];


const getCarBrandLogo = (name: string) => {
  const brand = name.split(" ")[0]?.toLowerCase();
  return brand ? carBrandLogos[brand] : undefined;
};

const pendingCarsColumns: TableColumn<PendingCarRow>[] = [
  {
    id: "name",
    header: "Make & model",
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100">
          {(() => {
            const logo = getCarBrandLogo(row.name);
            if (!logo) {
              return (
                <span className="text-xs font-semibold text-slate-700">
                  {row.name.split(" ")[0]}
                </span>
              );
            }

            return (
              <Image
                src={logo}
                alt={`${row.name} logo`}
                width={40}
                height={40}
                className="h-8 w-8 object-contain"
              />
            );
          })()}
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">{row.vendor.name}</p>
        </div>
      </div>
    )
  },
  {
    id: "type",
    header: "Type",
    accessor: "type",
    className: "text-sm font-medium text-slate-900"
  },
  {
    id: "year",
    header: "Year",
    accessor: "year",
    sortable: true,
    align: "center",
    className: "text-sm font-semibold text-slate-900"
  },
  {
    id: "vendor",
    header: "Vendor",
    render: (row: any) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-8 w-8 border border-slate-100 bg-slate-50 text-xs font-semibold text-slate-700">
          <AvatarFallback>{row.vendor.initials}</AvatarFallback>
        </Avatar>
        <p className="text-sm font-semibold text-slate-900">{row.vendor.name}</p>
      </div>
    )
  },
  {
    id: "minPrice",
    header: "Min price",
    accessor: "minPrice",
    align: "right",
    className: "text-sm font-semibold text-slate-900"
  },
  {
    id: "maxPrice",
    header: "Max price",
    accessor: "maxPrice",
    align: "right",
    className: "text-sm font-semibold text-slate-900"
  },
  {
    id: "pendingActions",
    header: "",
    align: "right",
    render: (row: any) => (
      <div className="flex items-center justify-end gap-3">
        <button className="text-sm font-semibold flex items-center gap-2 text-blue-600 hover:text-blue-700">
          <Eye className="h-4 w-4" />
          Details
        </button>
        <button className="text-sm font-semibold flex items-center gap-2 text-green-600 hover:text-green-700">
          <CheckCircle className="h-4 w-4" />
          Approve
        </button>
        <button className="text-sm font-semibold flex items-center gap-2 text-red-500 hover:text-red-600">
          <XCircle className="h-4 w-4" />
          Reject
        </button>
      </div>
    )
  }
];

const Dashboard = () => {
  return (
    <div className="space-y-4 sm:space-y-6">

      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        actions={
          <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
            <TrendingUp className="mr-2 w-4 h-4" />
            Generate Report
          </Button>
        }
      />

      {/* Cars Overview */}
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3 xl:grid-cols-5">
        {carsOverviewStats.map((card) => (
          <OverviewStatCard
            key={card.label}
            {...card}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Vendors Overview */}
        <section className="space-y-2 flex-1">
          <h3 className="text-base font-semibold text-slate-800 sm:text-lg">Vendors overview</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {vendorOverviewStats.map((card) => (
              <OverviewSummaryCard key={card.title} {...card} />
            ))}
          </div>
        </section>

        {/* Drivers Overview */}
        <section className="space-y-2 flex-1">
          <h3 className="text-base font-semibold text-slate-800 sm:text-lg">Drivers overview</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
            {driverOverviewStats.map((card) => (
              <OverviewSummaryCard key={card.title} {...card} />
            ))}
          </div>
        </section>
      </div>

      {/* Cars on rent */}
      <section className="space-y-2 sm:space-y-3">
        <Table
          title="Cars on rent"
          description="Live rentals across all vendors"
          columns={carsOnRentColumns}
          data={carsOnRentData}
          enablePagination
          pageSize={5}
          getRowId={(row: any) => row.id}
          rowClassName={(row: any) =>
            (row as CarRentalRow).status === "alert"
              ? "bg-red-50/80 [&_td]:text-red-900 hover:bg-red-50"
              : undefined
          }
          headerAction={
            <Button
              size="icon"
              variant="ghost"
              className="h-9 w-9 rounded-full border border-slate-200 text-slate-600 hover:border-slate-300"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          }
        />
      </section>

      {/* Pending cars */}
      <section className="space-y-2 sm:space-y-3">
        <Table
          title="Pending cars"
          description="Awaiting review from onboarding team"
          columns={pendingCarsColumns}
          data={pendingCarsData}
          enablePagination
          pageSize={5}
          getRowId={(row: any) => row.id}
          rowClassName={(row: any, index: number) => {
            if ((row as PendingCarRow).status === "priority") {
              return "bg-indigo-50/80 [&_td]:text-indigo-900 hover:bg-indigo-50";
            }
            return index % 2 === 0 ? "bg-slate-50/40" : undefined;
          }}
          headerAction={
            <Button className="rounded-full bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
              See all
            </Button>
          }
        />
      </section>

    </div>
  );
}

export default Dashboard;