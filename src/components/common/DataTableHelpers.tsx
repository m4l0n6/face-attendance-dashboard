import { ColumnDef } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowUpDown, Edit, Trash2, ExternalLink } from "lucide-react"

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
      className="mr-0"
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="mr-0"
    />
  ),
  enableSorting: false,
  enableHiding: false,
  size: 50,
});

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
      <ButtonGroup>
        {actions.onView && (
          <ButtonGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => actions.onView?.(item)}
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        )}
        {actions.onEdit && (
          <ButtonGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => actions.onEdit?.(item)}
            >
              <Edit className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        )}
        {actions.onDelete && (
          <ButtonGroup>
            <Button
              variant="ghost"
              size='icon'
              onClick={() => actions.onDelete?.(item)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </ButtonGroup>
        )}
      </ButtonGroup>
    );
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

// Index column (STT - Số thứ tự)
export const createIndexColumn = <T,>(
  options?: {
    size?: number
    header?: string
    className?: string
  }
): ColumnDef<T> => ({
  id: "stt",
  header: options?.header || "STT",
  cell: ({ row, table }) => {
    const meta = table.options.meta as { pagination?: { currentPage: number; pageSize?: number } } | undefined
    const pagination = meta?.pagination
    
    let index = row.index + 1
    
    // Nếu có server-side pagination, tính offset
    if (pagination && pagination.currentPage) {
      const pageSize = pagination.pageSize || 20
      const offset = (pagination.currentPage - 1) * pageSize
      index = offset + row.index + 1
    }
    
    return (
      <div className={`text-center ${options?.className || ''}`}>
        {index}
      </div>
    )
  },
  enableSorting: false,
  enableHiding: false,
  size: options?.size || 60,
})

// Filter Select Helper Component
export interface FilterSelectOption {
  label: string
  value: string
}

export const createFilterSelect = (
  options: FilterSelectOption[],
  config: {
    value: string | null
    onValueChange: (value: string | null) => void
    placeholder?: string
    allLabel?: string
    className?: string
  }
) => {
  return (
    <Select
      value={config.value || "all"}
      onValueChange={(value) => config.onValueChange(value === "all" ? null : value)}
    >
      <SelectTrigger className={config.className || "w-[200px]"}>
        <SelectValue placeholder={config.placeholder || "Tất cả"} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{config.allLabel || "Tất cả"}</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
