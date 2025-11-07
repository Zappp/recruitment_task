import styles from './App.module.css'
import { PeselValidator } from './pesel-validator/PeselValidator'
import { TextScrambler } from './text-scrambler/TextScrambler'
import { UserList } from './users-list/UserList'

function App() {
  return (
    <div className={styles.app}>
      <header className={styles.appHeader}>
        <h1>Zadania rekrutacyjne</h1>
      </header>
      <main id="main-content" className={styles.appMain}>
        <TextScrambler />
        <PeselValidator />
        <UserList />
      </main>
    </div>
  )
}

export default App
