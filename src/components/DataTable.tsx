import { flexRender, type Table, type PaginationState } from '@tanstack/react-table'

interface DataTableProps<T> {
  table: Table<T>
  loading?: boolean
  emptyMessage?: string
  dataLength: number
  className?: string
  loadingOverlayClassName?: string
  emptyStateClassName?: string
  pagination?: PaginationState
  pageCount?: number
  isPending?: boolean
  onNextPage?: () => void
  onPrevPage?: () => void
  paginationClassName?: string
  buttonClassName?: string
  tableContainerClassName?: string
  tableWrapperClassName?: string
  showPagination?: boolean
}

export function DataTable<T>({
  table,
  loading = false,
  emptyMessage = 'Brak danych do wyświetlenia',
  dataLength,
  className = '',
  loadingOverlayClassName = '',
  emptyStateClassName = '',
  pagination,
  pageCount = 1,
  isPending = false,
  onNextPage,
  onPrevPage,
  paginationClassName = '',
  buttonClassName = '',
  tableContainerClassName = '',
  tableWrapperClassName = '',
  showPagination = false,
}: DataTableProps<T>) {
  return (
    <>
      <div className={tableContainerClassName}>
        {loading && (
          <div className={loadingOverlayClassName || 'data-table-loading-overlay'}>
            <div>Ładowanie...</div>
          </div>
        )}
        <div className={tableWrapperClassName}>
          <table className={className || 'data-table'} role="table" aria-label="Tabela danych">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} scope="col">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {!loading && dataLength === 0 ? (
                <tr>
                  <td
                    colSpan={table.getAllColumns().length}
                    className={emptyStateClassName || 'data-table-empty-state'}
                  >
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell ?? (({ row }) => row.getValue(cell.column.id)),
                          cell.getContext(),
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showPagination && pagination && onNextPage && onPrevPage && (
        <nav className={paginationClassName} aria-label="Nawigacja paginacji">
          <button
            type="button"
            className={buttonClassName}
            disabled={pagination.pageIndex === 0 || loading || isPending}
            onClick={onPrevPage}
            aria-label="Poprzednia strona"
          >
            Poprzednia
          </button>
          <span aria-live="polite" aria-atomic="true">
            Strona {pagination.pageIndex + 1} z {pageCount}
          </span>
          <button
            type="button"
            className={buttonClassName}
            disabled={pagination.pageIndex + 1 === pageCount || loading || isPending}
            onClick={onNextPage}
            aria-label="Następna strona"
          >
            Następna
          </button>
        </nav>
      )}
    </>
  )
}
