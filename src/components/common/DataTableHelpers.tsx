import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"

// Types for common column configurations
export interface SelectableColumn {
  enableSelection: true
}

export interface SortableColumn {
  enableSorting: true
}

export interface ActionsColumn {
  enableActions: true
  onView?: (item: unknown) => void
  onEdit?: (item: unknown) => void
  onDelete?: (item: unknown) => void
}

// Utility functions for common column types

// Selection column
export const createSelectionColumn = <T,>(): ColumnDef<T> => ({
  id: "select",
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  ),
  enableSorting: false,
  enableHiding: false,
})

// Sortable column with header and built-in styling
export const createSortableColumn = <T,>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number
    cell?: (value: unknown) => React.ReactNode
    className?: string
  }
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center hover:text-foreground transition-colors cursor-pointer"
    >
      {header}
      <ArrowUpDown className="ml-2 w-4 h-4" />
    </div>
  ),
  cell: options?.cell ? ({ getValue }) => (
    <div className={options.className}>{options.cell!(getValue())}</div>
  ) : ({ getValue }) => (
    <div className={options?.className}>{getValue() as string}</div>
  ),
  size: options?.size,
})

// Simple column without sorting but with styling
export const createSimpleColumn = <T,>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number
    cell?: (value: unknown) => React.ReactNode
    className?: string
  }
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header,
  cell: options?.cell ? ({ getValue }) => (
    <div className={options.className}>{options.cell!(getValue())}</div>
  ) : ({ getValue }) => (
    <div className={options?.className}>{getValue() as string}</div>
  ),
  size: options?.size,
})

// Actions column with dropdown and styling
export const createActionsColumn = <T,>(
  actions: {
    onView?: (item: T) => void
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
  },
  options?: {
    size?: number
    header?: string
  }
): ColumnDef<T> => ({
  id: "actions",
  header: options?.header || "Thao tác",
  cell: ({ row }) => {
    const item = row.original

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="p-0 w-8 h-8">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {actions.onView && (
            <DropdownMenuItem onClick={() => actions.onView?.(item)}>
              <Eye className="mr-2 w-4 h-4" />
              View
            </DropdownMenuItem>
          )}
          {actions.onEdit && (
            <DropdownMenuItem onClick={() => actions.onEdit?.(item)}>
              <Edit className="mr-2 w-4 h-4" />
              Edit
            </DropdownMenuItem>
          )}
          {actions.onDelete && (
            <DropdownMenuItem 
              onClick={() => actions.onDelete?.(item)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 w-4 h-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  },
  enableSorting: false,
  enableHiding: false,
  size: options?.size || 80,
})

// Status badge column with styling
export const createStatusColumn = <T,>(
  accessorKey: keyof T,
  statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }>,
  options?: {
    size?: number
    header?: string
  }
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: options?.header || "Status",
  cell: ({ getValue }) => {
    const status = getValue() as string
    const config = statusConfig[status]
    
    if (!config) return <span>{status}</span>
    
    return (
      <Badge variant={config.variant}>
        {config.label}
      </Badge>
    )
  },
  size: options?.size || 100,
})

// Date column with formatting and styling
export const createDateColumn = <T,>(
  accessorKey: keyof T,
  header: string,
  options?: {
    size?: number
    format?: (date: Date) => string
    className?: string
  }
): ColumnDef<T> => ({
  accessorKey: accessorKey as string,
  header: ({ column }) => (
    <div
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      className="flex items-center hover:text-foreground transition-colors cursor-pointer"
    >
      {header}
      <ArrowUpDown className="ml-2 w-4 h-4" />
    </div>
  ),
  cell: ({ getValue }) => {
    const date = getValue() as Date | string
    const dateObj = typeof date === 'string' ? new Date(date) : date
    const formatter = options?.format || ((d: Date) => d.toLocaleDateString())
    return (
      <div className={`text-sm ${options?.className || ''}`}>
        {formatter(dateObj)}
      </div>
    )
  },
  size: options?.size || 120,
})
