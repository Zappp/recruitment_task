import { ACCESS_TOKEN_KEY } from './constants'

export function scrambleText(text: string): string {
  return text
    .split('\n')
    .map((line) => scrambleLine(line))
    .join('\n')
}

export function scrambleLine(line: string): string {
  return line.replace(/(?<!\S)\S+(?!\S)/gu, (token) => {
    const chars = token.split('')
    const isLetter = (c: string) => /\p{L}/u.test(c)

    const letterIndices: number[] = []
    for (let idx = 0; idx < chars.length; idx++) {
      if (isLetter(chars[idx])) letterIndices.push(idx)
    }

    if (letterIndices.length <= 2) {
      return token
    }

    const innerLetterIndices = letterIndices.slice(1, -1)
    const innerLetters = innerLetterIndices.map((idx) => chars[idx])

    for (let i = innerLetters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[innerLetters[i], innerLetters[j]] = [innerLetters[j], innerLetters[i]]
    }

    innerLetterIndices.forEach((idx, i) => {
      chars[idx] = innerLetters[i]
    })

    return chars.join('')
  })
}

export function validatePesel(pesel: string): boolean {
  if (!/^[0-9]{11}$/u.test(pesel)) {
    return false
  }
  const monthWithCentury = Number(pesel.substring(2, 4))
  if (!monthWithCentury || monthWithCentury % 20 > 12) {
    return false
  }
  const day = Number(pesel.substring(4, 6))
  if (!day || day < 1 || day > 31) {
    return false
  }
  const times = [1, 3, 7, 9]
  const digits = `${pesel}`.split('').map((digit) => parseInt(digit, 10))
  const [dig11] = digits.splice(-1)
  const control =
    digits.reduce((previousValue, currentValue, index) => {
      return previousValue + currentValue * (times[index % 4] as number)
    }, 0) % 10

  return 10 - (control === 0 ? 10 : control) === dig11
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY)
}

export function setAccessToken(token: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
}
