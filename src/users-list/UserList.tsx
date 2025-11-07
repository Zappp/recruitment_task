import styles from './UserList.module.css'
import { EditUserModal } from './Modals/EditUserModal'
import { useUsersList } from './useUsersList'
import { TokenModal } from './Modals/TokenModal'
import { UsersTable } from './UsersTable'

export function UserList() {
  const {
    users,
    loading,
    error,
    pagination,
    pageCount,
    isPending,
    columnFilters,
    editingUser,
    showTokenModal,
    emailValue,
    handleEmailChange,
    setPagination,
    setColumnFilters,
    setEditingUser,
    saveEdit,
    nextPage,
    prevPage,
    setShowTokenModal,
  } = useUsersList()

  return (
    <section className={styles.userlistSection} aria-labelledby="userlist-heading">
      <h2 id="userlist-heading">Zadanie 3</h2>
      <div className={styles.userlistSearchContainer}>
        <label htmlFor="userlist-search" className="sr-only">
          Szukaj po emailu
        </label>
        <input
          id="userlist-search"
          className={styles.userlistSearch}
          type="text"
          placeholder="Szukaj po emailu"
          value={emailValue}
          onChange={handleEmailChange}
          aria-label="Szukaj użytkowników po adresie email"
        />
      </div>
      {error && (
        <div className={styles.userlistError} role="alert" aria-live="assertive">
          {error}
        </div>
      )}

      <UsersTable
        users={users}
        loading={loading}
        pagination={pagination}
        pageCount={pageCount}
        isPending={isPending}
        columnFilters={columnFilters}
        onPaginationChange={setPagination}
        onColumnFiltersChange={setColumnFilters}
        onEditUser={setEditingUser}
        onNextPage={nextPage}
        onPrevPage={prevPage}
      />

      {editingUser && (
        <EditUserModal
          user={editingUser}
          loading={loading}
          onClose={() => setEditingUser(null)}
          onSave={saveEdit}
        />
      )}

      {showTokenModal && (
        <TokenModal
          loading={loading}
          onClose={() => setShowTokenModal(false)}
          onSave={() => setShowTokenModal(false)}
        />
      )}
    </section>
  )
}
