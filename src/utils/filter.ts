import { Doctor } from "types/Doctor";
import { Speciality } from "types/Speciality";

export function filterDoctorsByProperty(doctorsArray: Doctor[], propertyName: keyof Doctor, propertyValue: boolean | number) {
  return doctorsArray.filter(doctor => doctor[propertyName] === propertyValue);
}

export function filterSpecialitiesBySex(specialitiesArray: Speciality[], sex: string) {
  const visibleSpecialities: string[] = [];

  specialitiesArray.map(speciality => {
    if (!speciality.params || ('gender' in speciality.params && speciality.params.gender === sex)) {
      visibleSpecialities.push(speciality.name);
    }
  });

  return visibleSpecialities;
}

export function filterHiddenSpecialities(specialities: Speciality[], currentAge: number): string[] {
  const hiddenSpecialities: string[] = [];

  specialities.filter((specialityItem: Speciality) => {
    if (specialityItem.params && 'minAge' in specialityItem.params && specialityItem.params.minAge > currentAge) {
      hiddenSpecialities.push(specialityItem.name);
      return false;
    }

    if (specialityItem.params && 'maxAge' in specialityItem.params && specialityItem.params.maxAge < currentAge) {
      hiddenSpecialities.push(specialityItem.name);
      return false;
    }

    return true;
  });

  return hiddenSpecialities;
}
