import React from "react";

export default function PoolsListTableSkeleton() {
  return (
    <tbody>
      {[1, 2, 3, 4, 5].map((value) => (
        <tr
          key={`pools_list_table_loading_${value}`}
          className="border-b border-black-300 last:border-0 dark:border-white-300"
        >
          <td className="flex items-center gap-4 py-4 pl-8">
            <div className="flex min-w-[30px] -space-x-4">
              <div className="h-10 w-10 animate-pulse rounded-full bg-black-300 dark:bg-white-300" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="h-4 w-32 animate-pulse bg-black-300 dark:bg-white-300" />
              <div className="h-3 w-20 animate-pulse bg-black-300 dark:bg-white-300" />
            </div>
          </td>
          <td>
            <div className="h-3 w-20 animate-pulse bg-black-300 dark:bg-white-300" />
          </td>
          <td>
            <div className="h-3 w-20 animate-pulse bg-black-300 dark:bg-white-300" />
          </td>
          <td>
            <div className="h-3 w-20 animate-pulse bg-black-300 dark:bg-white-300" />
          </td>
        </tr>
      ))}
    </tbody>
  );
}
