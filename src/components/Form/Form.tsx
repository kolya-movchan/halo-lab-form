/* eslint-disable import/no-unused-modules */
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { validation, handleKeyPress, validateInput } from 'utils/validation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getCities, getDoctors, getSpeciality } from 'api/fetch';
import { emailValidation, phoneValidation } from 'utils/regex';
import { getCurrentAge, isUnderage } from 'utils/ageCalculator';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { Logo } from 'components/Logo';

import { Inputs } from 'types/Inputs';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';
import { Doctor, DoctorWithInfo } from 'types/Doctor';

export const Form: React.FC = () => {
  const { register, setValue, handleSubmit, watch, reset, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = () => {
    // show success pop-up
    toast.success('Form submitted successfully!');
    // remove all fields data
    reset();
    // make Halo Lab to be a green light
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
  const [doctorsWithInfo, setDoctorsWithInfo] = useState<DoctorWithInfo[]>([]);
  const [visibleDoctors, setvisibleDoctors] = useState<DoctorWithInfo[]>([]);
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

  const emailCanBeSkipped = phoneValidation.test(phone) && phone.length >= 12;
  const phoneCanBeSkipped = emailValidation.test(watch("email"));
  const bothAreCorrect = emailCanBeSkipped && phoneCanBeSkipped;

  useEffect(() => {
    getCities(setCities);
    getSpeciality(setSpecialities, setVisibleSpecialities);
    getDoctors(setDoctors);
  }, [])

  useEffect(() => {
    // define doctor's speciality from the loaded specialities to reflect the valid data
    const doctorsExperience = doctors.map(doctor => {
    const targetSpeciality = specialities.find(speciality => speciality.id === doctor.specialityId);
    
        return {
          ...doctor,
          speciality: targetSpeciality?.name || 'undefined specialist'
        }
    });

    setDoctorsWithInfo(doctorsExperience);
    setvisibleDoctors(doctorsExperience);
  }, [doctors, specialities]);

  function filterDoctorsByProperty(doctorsArray: DoctorWithInfo[], propertyName: string, propertyValue: boolean | number) {
    return doctorsArray.filter(doctor => doctor[propertyName as keyof DoctorWithInfo] === propertyValue);
  }

  // this function will filter the doctor's list according to the date of birth, city and speciality choosed taking the copy of data from the pre-saved list of doctors called doctorsWithInfo and updating the visibleDoctors
  const filterAllDoctors = () => {
    let filteredDoctors = [...doctorsWithInfo];
    const currentCityId = cities.find(cityItem => cityItem.name === city)?.id || 0;
    const currentSpecialityId = specialities.find(specialityItem => specialityItem.name === speciality)?.id || 0;

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

    // setting this isDoctorPickedFirst to false in order for useEffect's check of !isDoctorPickedFirst remove the doctor's value with further data change
    setIsDoctorPickedFirst(false);
    setvisibleDoctors(filteredDoctors);
  }

  useEffect(() => {
    // if data, city or speciality is clicked thus, it was not a click on the doctor directly, we need to remove the picked doctor since any of the change can impact the visible list of the doctors
    if (!isDoctorPickedFirst) {
      setValue('doctor', '');
    }

    filterAllDoctors();

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
    let filteredSpecialities = [...specialities];

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

  // fill in city and speciality if they are empty, but the user decided to choose the doctor firstly
  const setUpDoctorInfo = () => {
    const currentDoctor = visibleDoctors.find(doctorProp => doctorProp.name === doctor) || null;

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
  }

  useEffect(() => {
    setUpDoctorInfo();
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
