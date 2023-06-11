/* eslint-disable import/no-unused-modules */
import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { validation, handleKeyPress, validateInput } from 'utils/validation';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { Inputs } from 'types/Inputs';
import { emailValidation, phoneValidation } from 'utils/regex';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';
import { Doctor, DoctorWithInfo } from 'types/Doctor';
import { getCities, getDoctors, getSpeciality } from 'api/request';
import { getCurrentAge, isUnderage } from 'utils/ageCalculator';
import { Logo } from 'components/Logo';

export const Form: React.FC = () => {
  const { register, setValue, handleSubmit, watch, reset, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => {
    console.log(data);
    toast.success('Form submitted successfully!');
    reset();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
    }, 6300);
  };

  const sexData: Sex[] = [{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }];
  const [cities, setCities] = useState<City[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [visibleSpecialities, setVisibleSpecialities] = useState<Speciality[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [doctorsWithInfo, setDoctorsWithInfo] = useState<DoctorWithInfo[]>([]);
  const [visibleDoctors, setvisibleDoctors] = useState<DoctorWithInfo[]>([]);
  const [isDoctorPickedFirst, setIsDoctorPickedFirst] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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

    setIsDoctorPickedFirst(false);
    setvisibleDoctors(filteredDoctors);
  }

  useEffect(() => {
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

    if (!city || !speciality) {
      setIsDoctorPickedFirst(true);
    }
  }

  useEffect(() => {
    setUpDoctorInfo();
  }, [doctor]);
  
  return (
    <>
     <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
        title="Doctor Speciality"
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


// Name - обязательно; не должно содержать числа
// Birthday Date - обязательно; дата, которая при вводе должна заполняться по правилу “день/месяц/год” - “31/12/2001”
// Sex - обязательно; select с вариантами Male & Female
// City - обязательно; select с вариантами городов, которые нужно получить из API https://run.mocky.io/v3/9fcb58ca-d3dd-424b-873b-dd3c76f000f4
// Doctor speciality - необязательно; список профессий врача, которые нужно получить из API https://run.mocky.io/v3/e8897b19-46a0-4124-8454-0938225ee9ca
// Doctor - обязательно; список, в котором указаны ФИО докторов и их опыт; получить из API https://run.mocky.io/v3/3d1c993c-cd8e-44c3-b1cb-585222859c21
// Email / Mobile number - хотя бы одно из полей обязательно, должны валидироваться в соответствии с предназначением
// При выборе даты рождения, список докторов должен фильтроваться по категории взрослый/детский врач.


// При выборе города, список врачей должен фильтроваться по выбранному городу
// При выборе пола, список специальностей врача должен фильтроваться по назначению специальности для пола; например, в списке не должно быть уролога либо гинеколога для неподходящего пола пациента.
// При выборе специальности врача, список врачей фильтруется по выбранной специальности.
// Если выбрать врача до заполнения связанных с ним полей, поля City и Speciality должны автоматически заполниться.
// Форма может быть отправлена, если все обязательные поля заполнены и нет ошибок.
