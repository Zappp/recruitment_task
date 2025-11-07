import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PeselValidator } from './PeselValidator'

const peselsMock = [
  { pesel: '44051401359', isValid: true },
  { pesel: '1234567890', isValid: false },
  { pesel: '44051401', isValid: false },
]

describe('PeselValidator', () => {
  peselsMock.forEach(({ pesel, isValid }) => {
    it(`shows ${isValid ? 'success' : 'error'} for pesel: ${pesel}`, async () => {
      render(<PeselValidator />)
      const input = screen.getByLabelText(/Numer PESEL/i)
      await userEvent.clear(input)
      await userEvent.type(input, pesel)
      if (isValid) {
        expect(screen.queryByText('PESEL jest poprawny!')).toBeInTheDocument()
        expect(screen.queryByText('Nieprawidłowy numer PESEL')).not.toBeInTheDocument()
        return
      }
      expect(screen.queryByText('Nieprawidłowy numer PESEL')).toBeInTheDocument()
      expect(screen.queryByText('PESEL jest poprawny!')).not.toBeInTheDocument()
    })
  })
})
