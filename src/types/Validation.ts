import { Error } from '../types/Error'

export type Validation = {
  name: DataFormat,
  email: DataFormat,
  phone: DataFormat,
  date: (value: string) => DataFormat,
}

export interface DataFormat {
  value: RegExp,
  message: Error,
}
