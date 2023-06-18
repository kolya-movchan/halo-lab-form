import { Doctor } from "types/Doctor";

export function filterDoctorsByProperty(doctorsArray: Doctor[], propertyName: keyof Doctor, propertyValue: boolean | number) {
  return doctorsArray.filter(doctor => doctor[propertyName] === propertyValue);
}
