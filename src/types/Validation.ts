import { Error } from '../types/Error'

export type Validation = {
  name: DataFormat,
  date: (value: string) => DataFormat,
  email: DataFormat,
  phone: DataFormat,
}

export interface DataFormat {
  value: RegExp,
  message: Error,
}
