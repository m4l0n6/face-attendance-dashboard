import React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  VisibilityState,
  Row,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Search, Settings2, RefreshCw, PlusCircle } from "lucide-react"
import EmptyData from "../empty"

interface ServerPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize?: number
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  onRowClick?: (row: Row<TData>) => void
  showColumnToggle?: boolean
  showPagination?: boolean
  pageSize?: number
  isLoading?: boolean
  onCreateClick?: () => void
  showCreateButton?: boolean
  onRefresh?: () => void
  showRefreshButton?: boolean
  pagination?: ServerPagination
  filterComponents?: React.ReactNode[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onRowClick,
  showColumnToggle = true,
  showPagination = true,
  pageSize = 10,
  onCreateClick,
  showCreateButton = true,
  onRefresh,
  showRefreshButton = true,
  pagination,
  filterComponents,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    // Chỉ dùng pagination model khi không có server-side pagination
    ...(pagination ? {} : { getPaginationRowModel: getPaginationRowModel() }),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
    meta: {
      pagination,
    },
  })

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex justify-between items-center">
        <div className="flex flex-1 items-center space-x-2">
          {searchKey && (
            <div className="relative max-w-sm">
              <Search className="top-2.5 left-2 absolute w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={searchPlaceholder}
                value={searchValue !== undefined ? searchValue : (table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
                onChange={(event) => {
                  if (onSearchChange) {
                    onSearchChange(event.target.value)
                  } else {
                    table.getColumn(searchKey)?.setFilterValue(event.target.value)
                  }
                }}
                className="pl-8"
              />
            </div>
          )}
          {showCreateButton && onCreateClick && (
            <Button onClick={onCreateClick}>
              <PlusCircle color="#fff" />
              Thêm mới
            </Button>
          )}
          {showRefreshButton && onRefresh && (
            <Button 
              variant="outline" 
              onClick={onRefresh}
            >
              <RefreshCw className="w-4 h-4" />
              Làm mới
            </Button>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Filter Components */}
          {filterComponents && filterComponents.map((component, index) => (
            <div key={index}>
              {component}
            </div>
          ))}
        
          {showColumnToggle && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="hidden lg:flex ml-auto h-8"
              >
                <Settings2 className="mr-2 w-4 h-4" />
                Hiển thị
                <ChevronDown className="ml-2 w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[150px]">
              {table
                .getAllColumns()
                .filter(
                  (column) =>
                    typeof column.accessorFn !== "undefined" && column.getCanHide()
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
              })}
            </DropdownMenuContent>
          </DropdownMenu>
      )}
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead 
                      key={header.id}
                      className="px-2 lg:px-3 py-2 font-medium text-left"
                      style={{ 
                        width: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto',
                        minWidth: header.column.columnDef.size ? `${header.column.columnDef.size}px` : 'auto'
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={onRowClick ? "cursor-pointer hover:bg-muted/50" : ""}
                  onClick={() => onRowClick?.(row)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell 
                      key={cell.id}
                      className="px-2 lg:px-3 py-2 text-left align-middle"
                      style={{ 
                        width: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'auto',
                        minWidth: cell.column.columnDef.size ? `${cell.column.columnDef.size}px` : 'auto'
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <EmptyData />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {showPagination && (
        pagination ? (
          // Server-side pagination
          <div className="flex justify-between items-center space-x-2 py-4">
            <div className="flex-1 text-muted-foreground text-sm">
              Tổng số {pagination.totalItems} sinh viên
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              {pagination.onPageSizeChange && (
                <div className="flex items-center space-x-2">
                  <p className="font-medium text-sm">Số hàng</p>
                  <select
                    value={pagination.pageSize || 10}
                    onChange={(e) => pagination.onPageSizeChange!(Number(e.target.value))}
                    className="bg-transparent px-3 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2 w-[70px] h-8 text-sm"
                  >
                    {[10, 20, 30, 40, 50, 100].map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <div className="flex justify-center items-center w-[150px] font-medium text-sm">
                Trang {pagination.currentPage} trên {pagination.totalPages}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden lg:flex p-0 w-8 h-8"
                  onClick={() => pagination.onPageChange(1)}
                  disabled={pagination.currentPage === 1}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  className="p-0 w-8 h-8"
                  onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                >
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  className="p-0 w-8 h-8"
                  onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  className="hidden lg:flex p-0 w-8 h-8"
                  onClick={() => pagination.onPageChange(pagination.totalPages)}
                  disabled={pagination.currentPage === pagination.totalPages}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Client-side pagination
          <div className="flex justify-between items-center space-x-2 py-4">
            <div className="flex-1 text-muted-foreground text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <p className="font-medium text-sm">Rows per page</p>
                <select
                  value={table.getState().pagination.pageSize}
                  onChange={(e) => {
                    table.setPageSize(Number(e.target.value))
                  }}
                  className="bg-transparent px-3 py-1 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring ring-offset-background focus:ring-offset-2 w-[70px] h-8 text-sm"
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      {pageSize}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-center items-center w-[100px] font-medium text-sm">
                Page {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  className="hidden lg:flex p-0 w-8 h-8"
                  onClick={() => table.setPageIndex(0)}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<<"}
                </Button>
                <Button
                  variant="outline"
                  className="p-0 w-8 h-8"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                >
                  {"<"}
                </Button>
                <Button
                  variant="outline"
                  className="p-0 w-8 h-8"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                >
                  {">"}
                </Button>
                <Button
                  variant="outline"
                  className="hidden lg:flex p-0 w-8 h-8"
                  onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                  disabled={!table.getCanNextPage()}
                >
                  {">>"}
                </Button>
              </div>
            </div>
          </div>
        )
      )}


    </div>
  )
}
