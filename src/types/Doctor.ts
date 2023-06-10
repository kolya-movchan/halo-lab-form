export interface Doctor {
  id: number,
  name: string,
  surname: string,
  specialityId: number,
  isPediatrician: boolean,
  cityId: number,
}

export interface DoctorWithInfo extends Doctor {
  speciality: string
}
