import { Validation } from 'types/Validation'
import { Error } from '../types/Error'
import { emailValidation, nameValidation, phoneValidation } from './regex'
import { isAfter } from 'date-fns';


export const validation: Validation = {
  name: {
    value: nameValidation,
    message: Error.NAME,
  },

  date(value) {
    const isFutureDate = isAfter(new Date(value), new Date());
  
    if (isFutureDate) {
      return {
        value: /^(?![\s\S])/,
        message: Error.DATE,
      };
    }

    return {
      value: new RegExp('.*'),
      message: Error.DATE,
    };
  },
  email: {
    value: emailValidation,
    message: Error.EMAIL,
  },
  phone: {
    value: phoneValidation,
    message: Error.PHONE,
  },
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

export function validateInput(event: React.KeyboardEvent<HTMLInputElement>) {
  const input = event.key;
  const regex = /^[^a-z ,.'-]*$/i;

  if (regex.test(input)) {
    event.preventDefault()
  }
}

export function validateDate(event: React.ChangeEvent<HTMLInputElement>) {
  const selectedDate = new Date (event.target.value);
  const currentDate = new Date();

  console.log(isAfter(selectedDate, currentDate));

  console.log(selectedDate, currentDate);

}
