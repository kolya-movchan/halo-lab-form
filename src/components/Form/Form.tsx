/* eslint-disable import/no-unused-modules */
import React, { useEffect, useMemo, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { validation, handleKeyPress, validateInput } from 'utils/validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getCities, getDoctors, getSpecialities } from 'api/fetch';
import { emailValidation, phoneValidation } from 'utils/regex';
import { getCurrentAge, isUnderage } from 'utils/ageCalculator';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { Logo } from 'components/Logo';

import { Inputs } from 'types/Inputs';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';
import { Doctor } from 'types/Doctor';
import { filterDoctorsByProperty } from 'utils/filter';

export const Form: React.FC = () => {
  const { register, setValue, handleSubmit, watch, reset, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = () => {
    // show success pop-up
    toast.success('Form submitted successfully!');
    // remove all fields data
    reset();
    // make Halo Lab shines a green light
    setIsSuccess(true);
    // reset Halo Lab light to transparent
    setTimeout(() => {
      setIsSuccess(false);
    }, 6300);
  };

  const [cities, setCities] = useState<City[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [visibleSpecialities, setVisibleSpecialities] = useState<Speciality[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isDoctorPickedFirst, setIsDoctorPickedFirst] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const sexData: Sex[] = [{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }];

  const phone = watch("mobile number");
  const date = watch("date");
  const city = watch("city");
  const sex = watch("sex");
  const speciality = watch("speciality");
  const doctor = watch("doctor");

  const child = date ? isUnderage(date): false;
  const currentAge = getCurrentAge(date);

  console.log('child', child);
  console.log('currentAge', currentAge);

  const emailCanBeSkipped = phoneValidation.test(phone) && phone.length >= 12;
  const phoneCanBeSkipped = emailValidation.test(watch("email"));
  const bothAreCorrect = emailCanBeSkipped && phoneCanBeSkipped;

  useEffect(() => {
    getCities(setCities);
    getSpecialities(setSpecialities, setVisibleSpecialities);
    getDoctors(setDoctors);
  }, [])

  const doctorsWithInfo = useMemo(() => {
    const specialitiesLookup: Record<string, Speciality> = specialities.reduce(
      (lookup, speciality) => {
        lookup[speciality.id] = speciality;
        return lookup;
      },
      {} as Record<string, Speciality>
    );

    const doctorsWithSpeciality: Doctor[] = doctors.map((doctor) => ({
      ...doctor,
      speciality: specialitiesLookup[doctor.specialityId]?.name || 'undefined specialist',
    }));

    return doctorsWithSpeciality;

  }, [specialities, doctors]);

  const visibleDoctors = useMemo(() => {
    let filteredDoctors = doctorsWithInfo;

    const currentCityId = cities.find(cityItem => cityItem.name === city)?.id || 0;
    const currentSpecialityId = specialities.find(specialityItem => specialityItem.name === speciality)?.id || 0;

    // these functions will filter the doctor's list according to the date of birth, city and speciality choosed taking the copy of data from the pre-saved list of doctors called doctorsWithInfo and updating the visibleDoctors
    if (child) {
      filteredDoctors = filterDoctorsByProperty(filteredDoctors, 'isPediatrician', true);

    } else if (date) {
      filteredDoctors = filterDoctorsByProperty(filteredDoctors, 'isPediatrician', false);
    }

    if (currentCityId > 0) {
      filteredDoctors = filterDoctorsByProperty(filteredDoctors, 'cityId', currentCityId);
    }

    if (currentSpecialityId > 0) {
      filteredDoctors = filterDoctorsByProperty(filteredDoctors, 'specialityId', currentSpecialityId);
    }

    return filteredDoctors;

  }, [doctorsWithInfo, date, child, city, speciality, cities, specialities]);

  useEffect(() => {
    // if data, city or speciality is clicked thus, it was not a click on the doctor directly, we need to remove the picked doctor since any of the change can impact the visible list of the doctors
    if (!isDoctorPickedFirst) {
      setValue('doctor', '');
    }

    setIsDoctorPickedFirst(false);

  }, [date, city, speciality]);

  function filterSpecialitiesBySex(specialitiesArray: Speciality[], sex: string) {
    return specialitiesArray.filter(speciality => {
      if (!speciality.params || ('gender' in speciality.params && speciality.params.gender === sex)) {
        return speciality;
      }
    });
  }

  // this is a function for controling specialities depending on the date of birth selected and the sex
  const filterAllSpecialities = () => {
    let filteredSpecialities = specialities;

    filteredSpecialities = filteredSpecialities.filter(specialityItem => {
      if (specialityItem.params && ('minAge' in specialityItem.params && specialityItem.params.minAge > currentAge)) {
        return false
      }

      if (specialityItem.params && ('maxAge' in specialityItem.params && specialityItem.params.maxAge < currentAge)) {
        return false
      }

      return true;
    })

    if (sex === 'Male') {
      filteredSpecialities = filterSpecialitiesBySex(filteredSpecialities, 'Male');
    }

    if (sex === 'Female') {
      filteredSpecialities = filterSpecialitiesBySex(filteredSpecialities, 'Female');
    }

    setVisibleSpecialities(filteredSpecialities);
  }

  useEffect(() => {
    filterAllSpecialities();
  }, [sex, date]);

  useEffect(() => {
    // fill in city and speciality if they are empty, but the user decided to choose the doctor firstly

    const currentDoctor = doctors.find(doctorProp => doctorProp.name === doctor) || null;

    if (!city && currentDoctor) {
      const currentDoctorCity = currentDoctor.cityId;
      const currentCity = cities.find(city => city.id === currentDoctorCity)?.name || '';

      setValue('city', currentCity);
    }

    if (!speciality && currentDoctor) {
      const currentDoctorSpecialityId = currentDoctor.specialityId;
      const currentSpeciality = specialities.find(speciality => speciality.id === currentDoctorSpecialityId)?.name || '';

      setValue('speciality', currentSpeciality);
    }

    // if there is no city or speciality we set doctorPickedFirst to true for !isDoctorPickedFirst check in useEffect [date, city, speciality] get failed and do not remove the selected doctor
    if (!city || !speciality) {
      setIsDoctorPickedFirst(true);
    }
  }, [doctor]);
  
  return (
    <>
     <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className='form'
     >
      <Input
        type="text"
        name="name"
        register={register}
        error={errors}
        required={true}
        pattern={validation.name}
        max={30}
        onKeyPress={validateInput}
      />

      <Input
        type="date"
        name="date"
        register={register}
        error={errors}
        required={true}
        pattern={validation.date(date)}
       />

      <Select
        name="sex"
        register={register}
        value={sex}
        error={errors}
        required={true}
        data={sexData}
       />

      <Select
        name="city"
        register={register}
        value={city}
        error={errors}
        required={true}
        data={cities}
      />

      <Select
        name="speciality"
        register={register}
        value={speciality}
        error={errors}
        data={visibleSpecialities}
      />

      <Select
        name="doctor"
        register={register}
        value={doctor}
        error={errors}
        required={true}
        data={visibleDoctors}
      />

      <Input
        type="email"
        name="email"
        register={register}
        error={errors}
        pattern = {validation.email}
        max={50}
        required={!emailCanBeSkipped || bothAreCorrect}
       />

      <Input
        type="tel"
        name="mobile number"
        placeholder="+380"
        register={register}
        error={errors}
        defaultValue='+380'
        pattern = {validation.phone}
        onKeyPress={handleKeyPress}
        max={13}
        required={!phoneCanBeSkipped || bothAreCorrect }
       />

      <button
        type="submit"
        className='button is-success is-light button-submit'
        style={{ width: '100px', margin: '0 auto' }}
      >
        Submit
      </button>
     </form>

     <ToastContainer />
     <Logo isSuccess={isSuccess} />
    </>
  );
}
