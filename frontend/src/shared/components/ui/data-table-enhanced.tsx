import React, { useState, useMemo } from 'react'
import {
  ChevronDown,
  ChevronUp,
  Search,
  Filter,
  Download,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import {
  Button,
  Input,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Badge,
  Card,
  CardContent
} from '@/shared/components/ui'
import { cn } from '@/shared/utils/cn'

export interface Column<T = any> {
  key: string
  title: string
  titleAr?: string
  width?: string | number
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: T, index: number) => React.ReactNode
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  hidden?: boolean
}

export interface DataTableProps<T = any> {
  data: T[]
  columns: Column<T>[]
  loading?: boolean
  pagination?: {
    current: number
    pageSize: number
    total: number
    showSizeChanger?: boolean
    showQuickJumper?: boolean
    showTotal?: boolean
    onChange: (page: number, pageSize: number) => void
  }
  selection?: {
    selectedRowKeys: (string | number)[]
    onChange: (selectedRowKeys: (string | number)[], selectedRows: T[]) => void
    getRowKey: (record: T) => string | number
  }
  actions?: {
    view?: (record: T) => void
    edit?: (record: T) => void
    delete?: (record: T) => void
    approve?: (record: T) => void
    reject?: (record: T) => void
    custom?: Array<{
      label: string
      labelAr?: string
      icon?: React.ComponentType<{ className?: string }>
      onClick: (record: T) => void
      variant?: 'default' | 'destructive' | 'success'
    }>
  }
  bulkActions?: Array<{
    label: string
    labelAr?: string
    icon?: React.ComponentType<{ className?: string }>
    onClick: (selectedRows: T[]) => void
    variant?: 'default' | 'destructive' | 'success'
  }>
  searchable?: boolean
  exportable?: boolean
  locale?: 'en' | 'ar'
  emptyText?: string
  emptyTextAr?: string
  className?: string
}

const LoadingSkeleton = ({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="flex space-x-4 animate-pulse">
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div key={colIndex} className="h-4 bg-muted rounded flex-1" />
        ))}
      </div>
    ))}
  </div>
)

const EmptyState = ({ 
  text, 
  locale = 'en' 
}: { 
  text?: string
  locale?: 'en' | 'ar' 
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
      <svg
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        className="w-full h-full"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <p className="text-muted-foreground">
      {text || (locale === 'ar' ? 'لا توجد بيانات للعرض' : 'No data to display')}
    </p>
  </div>
)

export function DataTableEnhanced<T = any>({
  data,
  columns,
  loading = false,
  pagination,
  selection,
  actions,
  bulkActions,
  searchable = true,
  exportable = false,
  locale = 'en',
  emptyText,
  emptyTextAr,
  className
}: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState('')
  const [sortColumn, setSortColumn] = useState<string>('')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  
  const isRtl = locale === 'ar'
  const hasSelection = !!selection
  const hasActions = !!(actions?.view || actions?.edit || actions?.delete || actions?.approve || actions?.reject || actions?.custom?.length)
  
  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = data
    
    // Apply search
    if (searchQuery) {
      filtered = filtered.filter(item =>
        Object.values(item as any).some(value =>
          String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    }
    
    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = (a as any)[sortColumn]
        const bVal = (b as any)[sortColumn]
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1
        }
        return aVal < bVal ? 1 : -1
      })
    }
    
    return filtered
  }, [data, searchQuery, sortColumn, sortDirection, filters])
  
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(columnKey)
      setSortDirection('asc')
    }
  }
  
  const visibleColumns = columns.filter(col => !col.hidden)
  const selectedRows = selection ? data.filter(item => 
    selection.selectedRowKeys.includes(selection.getRowKey(item))
  ) : []
  
  return (
    <Card className={className}>
      {/* Header */}
      {(searchable || exportable || (bulkActions && selectedRows.length > 0)) && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between space-x-4 rtl:space-x-reverse">
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Search */}
              {searchable && (
                <div className="relative">
                  <Search className={cn(
                    "absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground",
                    isRtl ? "right-3" : "left-3"
                  )} />
                  <Input
                    placeholder={locale === 'ar' ? "البحث..." : "Search..."}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn(
                      "w-64",
                      isRtl ? "pr-10" : "pl-10"
                    )}
                  />
                </div>
              )}
              
              {/* Bulk Actions */}
              {bulkActions && selectedRows.length > 0 && (
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <span className="text-sm text-muted-foreground">
                    {locale === 'ar' 
                      ? `${selectedRows.length} عنصر محدد`
                      : `${selectedRows.length} selected`
                    }
                  </span>
                  {bulkActions.map((action, index) => (
                    <Button
                      key={index}
                      size="sm"
                      variant={action.variant || 'outline'}
                      onClick={() => action.onClick(selectedRows)}
                    >
                      {action.icon && (
                        <action.icon className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                      )}
                      {locale === 'ar' && action.labelAr ? action.labelAr : action.label}
                    </Button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              {/* Export */}
              {exportable && (
                <Button variant="outline" size="sm">
                  <Download className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                  {locale === 'ar' ? 'تصدير' : 'Export'}
                </Button>
              )}
              
              {/* Filters */}
              <Button variant="outline" size="sm">
                <Filter className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                {locale === 'ar' ? 'فلتر' : 'Filter'}
              </Button>
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <LoadingSkeleton />
            </div>
          ) : processedData.length === 0 ? (
            <EmptyState 
              text={locale === 'ar' && emptyTextAr ? emptyTextAr : emptyText} 
              locale={locale}
            />
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  {hasSelection && (
                    <th className="w-12 p-4">
                      <input
                        type="checkbox"
                        checked={selection!.selectedRowKeys.length === data.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            selection!.onChange(
                              data.map(selection!.getRowKey),
                              data
                            )
                          } else {
                            selection!.onChange([], [])
                          }
                        }}
                        className="rounded border-border"
                      />
                    </th>
                  )}
                  
                  {visibleColumns.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        "p-4 text-left font-medium text-muted-foreground",
                        column.align === 'center' && "text-center",
                        column.align === 'right' && "text-right",
                        isRtl && column.align === 'left' && "text-right",
                        isRtl && column.align === 'right' && "text-left",
                        column.sortable && "cursor-pointer hover:text-foreground"
                      )}
                      style={{ width: column.width }}
                      onClick={() => column.sortable && handleSort(column.key)}
                    >
                      <div className="flex items-center space-x-1 rtl:space-x-reverse">
                        <span>
                          {locale === 'ar' && column.titleAr ? column.titleAr : column.title}
                        </span>
                        {column.sortable && (
                          <div className="flex flex-col">
                            <ChevronUp className={cn(
                              "h-3 w-3",
                              sortColumn === column.key && sortDirection === 'asc' 
                                ? "text-primary" 
                                : "text-muted-foreground"
                            )} />
                            <ChevronDown className={cn(
                              "h-3 w-3 -mt-1",
                              sortColumn === column.key && sortDirection === 'desc' 
                                ? "text-primary" 
                                : "text-muted-foreground"
                            )} />
                          </div>
                        )}
                      </div>
                    </th>
                  ))}
                  
                  {hasActions && (
                    <th className="w-24 p-4 text-right">
                      {locale === 'ar' ? 'الإجراءات' : 'Actions'}
                    </th>
                  )}
                </tr>
              </thead>
              
              <tbody>
                {processedData.map((record, index) => {
                  const rowKey = selection?.getRowKey(record) || index
                  const isSelected = selection?.selectedRowKeys.includes(rowKey) || false
                  
                  return (
                    <tr
                      key={rowKey}
                      className={cn(
                        "border-b border-border hover:bg-muted/50 transition-colors",
                        isSelected && "bg-primary/5"
                      )}
                    >
                      {hasSelection && (
                        <td className="p-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              const newSelected = e.target.checked
                                ? [...selection!.selectedRowKeys, rowKey]
                                : selection!.selectedRowKeys.filter(k => k !== rowKey)
                              
                              const newSelectedRows = data.filter(item =>
                                newSelected.includes(selection!.getRowKey(item))
                              )
                              
                              selection!.onChange(newSelected, newSelectedRows)
                            }}
                            className="rounded border-border"
                          />
                        </td>
                      )}
                      
                      {visibleColumns.map((column) => {
                        const value = (record as any)[column.key]
                        
                        return (
                          <td
                            key={column.key}
                            className={cn(
                              "p-4",
                              column.align === 'center' && "text-center",
                              column.align === 'right' && "text-right",
                              isRtl && column.align === 'left' && "text-right",
                              isRtl && column.align === 'right' && "text-left"
                            )}
                          >
                            {column.render ? column.render(value, record, index) : String(value || '')}
                          </td>
                        )
                      })}
                      
                      {hasActions && (
                        <td className="p-4">
                          <div className="flex items-center justify-end space-x-1 rtl:space-x-reverse">
                            {actions?.view && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => actions.view!(record)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {actions?.edit && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => actions.edit!(record)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {actions?.approve && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-success hover:text-success"
                                onClick={() => actions.approve!(record)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {actions?.reject && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive"
                                onClick={() => actions.reject!(record)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                            
                            {(actions?.delete || actions?.custom?.length) && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="sm" variant="ghost">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  {actions?.custom?.map((action, index) => (
                                    <DropdownMenuItem
                                      key={index}
                                      onClick={() => action.onClick(record)}
                                      className={cn(
                                        action.variant === 'destructive' && "text-destructive",
                                        action.variant === 'success' && "text-success"
                                      )}
                                    >
                                      {action.icon && (
                                        <action.icon className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                                      )}
                                      {locale === 'ar' && action.labelAr ? action.labelAr : action.label}
                                    </DropdownMenuItem>
                                  ))}
                                  
                                  {actions?.delete && (
                                    <>
                                      {actions.custom?.length && <DropdownMenuSeparator />}
                                      <DropdownMenuItem
                                        onClick={() => actions.delete!(record)}
                                        className="text-destructive"
                                      >
                                        <Trash2 className={cn("h-4 w-4", isRtl ? "ml-2" : "mr-2")} />
                                        {locale === 'ar' ? 'حذف' : 'Delete'}
                                      </DropdownMenuItem>
                                    </>
                                  )}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination */}
        {pagination && !loading && processedData.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border">
            <div className="flex items-center space-x-2 rtl:space-x-reverse text-sm text-muted-foreground">
              {pagination.showTotal && (
                <span>
                  {locale === 'ar' 
                    ? `إجمالي ${pagination.total} عنصر`
                    : `Total ${pagination.total} items`
                  }
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.current === 1}
                onClick={() => pagination.onChange(pagination.current - 1, pagination.pageSize)}
              >
                {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                {locale === 'ar' ? 'السابق' : 'Previous'}
              </Button>
              
              <span className="text-sm text-muted-foreground">
                {locale === 'ar' 
                  ? `صفحة ${pagination.current} من ${Math.ceil(pagination.total / pagination.pageSize)}`
                  : `Page ${pagination.current} of ${Math.ceil(pagination.total / pagination.pageSize)}`
                }
              </span>
              
              <Button
                size="sm"
                variant="outline"
                disabled={pagination.current >= Math.ceil(pagination.total / pagination.pageSize)}
                onClick={() => pagination.onChange(pagination.current + 1, pagination.pageSize)}
              >
                {locale === 'ar' ? 'التالي' : 'Next'}
                {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}