export const formErrorMessages = {
  INVALID_PESEL: 'Nieprawidłowy numer PESEL',
  INVALID_FILE_FORMAT: 'Plik musi być plikiem tekstowym (.txt)',
  FILE_IS_TOO_LARGE: 'Plik nie może być większy niż 1MB',
  FILE_LOAD_ERROR: 'Wystąpił błąd podczas wczytywania pliku',
  FILE_NOT_LOADED: 'Najpierw wczytaj plik tekstowy',
  NAME_REQUIRED: 'Imię i nazwisko jest wymagane',
  EMAIL_INVALID: 'Nieprawidłowy email',
  USERS_FETCH_ERROR: 'Błąd pobierania użytkowników',
  UNAUTHORIZED: 'Brak autoryzacji. Wprowadź token dostępu.',
  USER_UPDATE_ERROR: 'Nie udało się zaktualizować użytkownika',
} as const

export const ACCESS_TOKEN_KEY = 'access_token'

const BASE_API_URL = 'https://gorest.co.in'
export const apiEndpoints = {
  users: BASE_API_URL + '/public/v2/users',
  accessToken: BASE_API_URL + '/my-account/access-tokens',
} as const
