import { useMemo } from 'react'
import type {
  ColumnDef,
  ColumnFiltersState,
  PaginationState,
  OnChangeFn,
} from '@tanstack/react-table'
import { getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { DataTable } from '../components/DataTable'
import type { User } from './useUsersList'
import styles from './UserList.module.css'

interface UsersTableProps {
  users: User[]
  loading: boolean
  pagination: PaginationState
  pageCount: number
  isPending: boolean
  columnFilters: ColumnFiltersState
  onPaginationChange: OnChangeFn<PaginationState>
  onColumnFiltersChange: OnChangeFn<ColumnFiltersState>
  onEditUser: (user: User) => void
  onNextPage: () => void
  onPrevPage: () => void
}

export function UsersTable({
  users,
  loading,
  pagination,
  pageCount,
  isPending,
  columnFilters,
  onPaginationChange,
  onColumnFiltersChange,
  onEditUser,
  onNextPage,
  onPrevPage,
}: UsersTableProps) {
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        id: 'id',
        cell: ({ row }) => row.getValue('id'),
      },
      {
        accessorKey: 'name',
        header: 'Imię i nazwisko',
        cell: ({ row }) => row.getValue('name'),
        filterFn: 'equalsString',
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) => row.getValue('email'),
        filterFn: 'equalsString',
      },
      {
        header: 'Płeć',
        accessorKey: 'gender',
        cell: ({ row }) => (row.getValue('gender') === 'female' ? 'kobieta' : 'mężczyzna'),
      },
      {
        header: 'Status',
        accessorKey: 'status',
        cell: ({ row }) => {
          const status = row.getValue('status')
          const gender = row.getValue('gender')
          const isActive = status === 'active'

          if (gender === 'female') {
            return isActive ? 'aktywna' : 'nieaktywna'
          }
          return isActive ? 'aktywny' : 'nieaktywny'
        },
      },
      {
        id: 'actions',
        header: 'Akcje',
        cell: ({ row }) => {
          const userName = row.getValue('name') as string
          return (
            <button
              type="button"
              className={styles.userlistEditBtn}
              onClick={() => onEditUser(row.original)}
              aria-label={`Edytuj użytkownika ${userName}`}
            >
              Edytuj
            </button>
          )
        },
      },
    ],
    [onEditUser],
  )

  const table = useReactTable({
    columns,
    data: users,
    pageCount,
    state: {
      columnFilters,
      pagination,
      columnVisibility: { id: false },
    },
    onPaginationChange,
    onColumnFiltersChange,
    manualPagination: true,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <DataTable
      table={table}
      loading={loading}
      dataLength={users.length}
      emptyMessage="Brak danych do wyświetlenia"
      className={styles.userlistTable}
      loadingOverlayClassName={styles.userlistLoadingOverlay}
      emptyStateClassName={styles.userlistEmptyState}
      tableContainerClassName={styles.userlistTableContainer}
      tableWrapperClassName={styles.userlistTableWrapper}
      pagination={pagination}
      pageCount={pageCount}
      isPending={isPending}
      onNextPage={onNextPage}
      onPrevPage={onPrevPage}
      buttonClassName={styles.userlistEditBtn}
      paginationClassName={styles.userlistPagination}
      showPagination={true}
    />
  )
}
