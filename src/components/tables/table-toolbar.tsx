"use client";

import { type Table } from "@tanstack/react-table";
import { type PopoverGroup } from "@/schemas/tables";

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
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={"Filter " + filter + "..."}
          value={(table.getColumn(filter)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(filter)?.setFilterValue(event.target.value)
          }
          className="h-8 w-[200px] lg:w-[300px]"
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
            className="h-8 px-2 lg:px-3"
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
