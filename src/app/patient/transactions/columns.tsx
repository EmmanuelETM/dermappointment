"use client";

import { type ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown, ReceiptText, Copy } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { type FullTransaction } from "@/schemas/transactions";
import { useRouter } from "next/navigation";

export const columns: ColumnDef<FullTransaction>[] = [
  {
    accessorKey: "doctor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Doctor
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const doctor = row.getValue("doctor");
      return <div className="pl-4">{String(doctor)}</div>;
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "procedure",
    header: "Procedure",
  },
  {
    accessorKey: "amount",
    header: () => "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const currency = row.original.currency ?? "USD";
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
      }).format(amount / 100);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-right">Actions</div>,
    enableHiding: false,
    cell: ({ row }) => {
      const transaction = row.original;
      // const router = useRouter();
      return (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open Menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(transaction.id!)}
              >
                <Copy />
                Copy Payment Id
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <ReceiptButton transactionId={transaction.id!} />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];

function ReceiptButton({ transactionId }: { transactionId: string }) {
  const router = useRouter();

  return (
    <DropdownMenuItem
      onClick={() => router.push(`/patient/transactions/${transactionId}`)}
    >
      <div className="flex flex-row items-center justify-between gap-2">
        <ReceiptText size={16} />
        <span>View Receipt</span>
      </div>
    </DropdownMenuItem>
  );
}
