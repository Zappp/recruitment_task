import type { ColumnFiltersState, PaginationState } from '@tanstack/react-table'
import { useState, useTransition, useEffect, useCallback } from 'react'
import { getAccessToken, clearAccessToken } from '../utils'
import { apiEndpoints, formErrorMessages } from '../utils/constants'

const USERS_PER_PAGE = 10
const DEBOUNCE_MS = 300

export interface User {
  id: number
  name: string
  email: string
  gender: 'male' | 'female'
  status: 'active' | 'inactive'
}

export const useUsersList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageCount, setPageCount] = useState(1)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [showTokenModal, setShowTokenModal] = useState(false)
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: USERS_PER_PAGE,
  })
  const [isPending, startTransition] = useTransition()
  const [debouncedFilters, setDebouncedFilters] = useState<ColumnFiltersState>([])

  const emailValue = String(columnFilters.find((f) => f.id === 'email')?.value ?? '')

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedFilters(columnFilters)
      setPagination((p) => ({ ...p, pageIndex: 0 }))
    }, DEBOUNCE_MS)
    return () => clearTimeout(handler)
  }, [columnFilters])

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      let url = `${apiEndpoints.users}?per_page=${pagination.pageSize}&page=${pagination.pageIndex + 1}`
      debouncedFilters.forEach((filter) => {
        url += `&${encodeURIComponent(filter.id)}=${encodeURIComponent(String(filter.value))}`
      })

      const res = await fetch(url)
      if (!res.ok) throw new Error('Failed to fetch users')

      const data = await res.json()
      const total = res.headers.get('x-pagination-pages') || res.headers.get('X-Pagination-Pages')
      setUsers(data)
      setPageCount(total ? Number(total) : 1)
    } catch (err) {
      setError((err as Error).message || formErrorMessages.USERS_FETCH_ERROR)
    } finally {
      setLoading(false)
    }
  }, [pagination, debouncedFilters])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const saveEdit = async (editedUser: User) => {
    setLoading(true)
    try {
      const token = getAccessToken()
      const res = await fetch(`${apiEndpoints.users}/${editedUser.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(editedUser),
      })

      if (!res.ok) {
        if (res.status === 401) {
          clearAccessToken()
          setShowTokenModal(true)
          throw new Error(formErrorMessages.UNAUTHORIZED)
        }

        setShowTokenModal(false)
        setEditingUser(null)
        await fetchUsers()
        throw new Error(formErrorMessages.USER_UPDATE_ERROR)
      }

      const updatedUser = await res.json()
      setEditingUser(null)
      setError(null)
      setUsers((users) => users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const nextPage = () => {
    if (pagination.pageIndex < pageCount - 1 && !loading && !isPending) {
      startTransition(() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex + 1 })))
    }
  }

  const prevPage = () => {
    if (pagination.pageIndex > 0 && !loading && !isPending) {
      startTransition(() => setPagination((p) => ({ ...p, pageIndex: p.pageIndex - 1 })))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setColumnFilters(value ? [{ id: 'email', value }] : [])
  }

  return {
    users,
    loading,
    error,
    pageCount,
    pagination,
    columnFilters,
    isPending,
    editingUser,
    showTokenModal,
    emailValue,
    fetchUsers,
    setEditingUser,
    setShowTokenModal,
    setPagination,
    setColumnFilters,
    handleEmailChange,
    saveEdit,
    nextPage,
    prevPage,
  }
}
