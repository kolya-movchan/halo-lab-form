import { Error } from '../types/Error'

export type Validation = {
  email: DataFormat,
  phone: DataFormat,
}

export interface DataFormat {
  value: RegExp,
  message: Error,
}
