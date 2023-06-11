export interface Speciality {
  id: number,
  name: string,
  params?: { gender: string } | { maxAge: number } | { minAge: number }
}
