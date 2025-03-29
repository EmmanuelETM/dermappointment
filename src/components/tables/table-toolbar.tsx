"use client";

import { type Table } from "@tanstack/react-table";
import { type PopoverGroup } from "@/types/tables";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "@/components/tables/view-options";

import { DataTableFacetedFilter } from "@/components/tables/faceted-filters";

type DataTableToolbarProps<TData> = {
  table: Table<TData>;
  filter: string;
  popoverConfig?: PopoverGroup;
};

export function DataTableToolbar<TData>({
  table,
  filter,
  popoverConfig,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 flex-wrap items-center space-x-2">
        <Input
          placeholder={"Filter " + filter + "..."}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
          className="h-8 min-w-[150px] sm:w-[200px] lg:w-[300px]"
        />
        {popoverConfig?.items.map((group) => (
          <DataTableFacetedFilter
            key={group.title}
            column={table.getColumn(group.column)}
            title={group.title}
            options={group.options}
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="mt-2 h-8 px-2 sm:mt-0 lg:px-3"
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
