"use client";

import React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TokenLogo from "@/components/TokenLogo";
import { cn, truncateAddress } from "@/utils/functions";
import { Icon, PoolsListTableSkeleton, Text } from "@/components";
import { CurrencyNumber } from "@/components/FormattedNumber";
import { usePools } from "@/contexts/PoolsProvider";
import { SOL_PRICE } from "@/utils/constants";

export interface TokenData {
  symbol: string;
  name: string;
  address: string;
  image: string;
}

export interface PairData {
  token: TokenData;
  currentPrice: string;
  priceChange24h: string;
  volume: string;
  liquidity: string;
  marketCap: string;
}

export interface PoolData {
  name: string;
  symbol: string;
  image: string;
  address: string;
  liquidity: number;
  marketCap: number;
  price: number;
}

const columns: ColumnDef<PoolData>[] = [
  {
    id: "pair",
    header: "PAIR INFO",
    cell: ({ row }) => (
      <div className="flex gap-4 items-center">
        <TokenLogo imageUrl={row.original.image} alt={row.original.name} size={10} />
        <div className="flex flex-col gap-1">
          <div className="flex gap-1">
            <Text variant="lg" className="font-bold">
              {row.original.symbol}
            </Text>
            <Text variant="lg" className="text-gray-400">
              / SOL
            </Text>
          </div>
          <Text className="text-gray-600">{truncateAddress(row.original.address)}</Text>
        </div>
      </div>
    ),
  },
  {
    id: "current_price",
    header: "PRICE",
    cell: ({ row }) => (
      <CurrencyNumber variant="lg" decimalScale={10} value={row.original.price * SOL_PRICE} />
    ),
  },
  {
    id: "liquidity",
    header: "LIQUIDITY",
    cell: ({ row }) => <CurrencyNumber variant="lg" value={row.original.liquidity} />,
  },
  {
    id: "market_cap",
    header: "MCAP",
    cell: ({ row }) => <CurrencyNumber variant="lg" value={row.original.marketCap} />,
  },
];

export default function Trading() {
  const router = useRouter();
  const { pools } = usePools();

  const table = useReactTable({
    data: pools || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualSorting: true,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-10 px-5 md:px-24">
      <div className="max-w-7xl w-full overflow-x-scroll">
        <Table className="table-fixed w-full min-w-[700px]">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="cursor-pointer">
                {headerGroup.headers.map((header, index) => (
                  <TableHead
                    key={header.id}
                    className={cn(
                      index === 0 ? "w-auto" : "w-[120px] md:w-[140px] lg:w-[180px]",
                      index === headerGroup.headers.length - 1 ? "pr-8" : "",
                      "py-4"
                    )}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div
                      className={cn(
                        "flex items-center gap-2",
                        header.column.getCanSort() ? "cursor-pointer select-none" : ""
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() ? (
                        <div className="flex flex-col -space-y-[2px]">
                          <Icon
                            name="sortUp"
                            className={cn(
                              "w-[6px] h-1",
                              header.column.getIsSorted() === false
                                ? "opacity-10"
                                : header.column.getIsSorted() !== "asc"
                                  ? "opacity-40"
                                  : ""
                            )}
                          />
                          <Icon
                            name="sortDown"
                            className={cn(
                              "w-[6px] h-1",
                              header.column.getIsSorted() === false
                                ? "opacity-10"
                                : header.column.getIsSorted() !== "desc"
                                  ? "opacity-30"
                                  : ""
                            )}
                          />
                        </div>
                      ) : null}
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          {pools ? (
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/trading/detail?address=${row.original.address}`)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="p-4">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-52 text-center">
                    <span>No pools available</span>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          ) : (
            <PoolsListTableSkeleton />
          )}
        </Table>
      </div>
    </main>
  );
}
