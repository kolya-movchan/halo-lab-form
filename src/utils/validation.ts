import { Validation } from 'types/Validation'
import { Error } from '../types/Error'
import { emailValidation, phoneValidation } from './regex'

export const validation: Validation = {
  email: {
    value: emailValidation,
    message: Error.INVALIDEMAIL,
  },
  phone: {
    value: phoneValidation,
    message: Error.INVALIDPHONE,
  }
}

export const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
  const keyValue = event.key;
  const input = event.target as HTMLInputElement;
  const currentValue = input.value;
  const isValidKey = /^[0-9]$/i.test(keyValue);

  if (currentValue === '' && keyValue !== '+') {
    event.preventDefault();
  } else if (currentValue.startsWith('+') && !isValidKey) {
    event.preventDefault();
  }
};