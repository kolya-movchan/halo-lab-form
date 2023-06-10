import React, { useEffect, useState } from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from '@hookform/devtools';

import { validation, handleKeyPress, validateInput } from 'utils/validation';
import { Input } from 'components/Input';
import { Select } from 'components/Select';
import { Inputs } from 'types/Inputs';
import { emailValidation, phoneValidation } from 'utils/regex';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';
import { Doctor } from 'types/Doctor';
import { getCities, getDoctors, getSpeciality } from 'api/request';

export const Form: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const sexData: Sex[] = [{ id: 1, name: 'Male' }, { id: 2, name: 'Female' }];
  const [cities, setCities] = useState<City[]>([]);
  const [specialities, setSpecialities] = useState<Speciality[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const phone = watch("mobile number");

  const emailCanBeSkipped = phoneValidation.test(phone) && phone.length >= 12;
  const phoneCanBeSkipped = emailValidation.test(watch("email"));
  const bothAreCorrect = emailCanBeSkipped && phoneCanBeSkipped;

  const doctorsWithInfo = doctors.map(doctor => {
    const targetSpeciality = specialities.find(speciality => speciality.id === doctor.specialityId);

    return {
      ...doctor,
      speciality: targetSpeciality?.name
    }
  })

  console.log(doctorsWithInfo);
  

  useEffect(() => {
    getCities(setCities);
    getSpeciality(setSpecialities);
    getDoctors(setDoctors);
  }, [])
  
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
        pattern={validation.date(watch('date'))}
       />

      <Select
        name="sex"
        register={register}
        value={watch("sex")}
        error={errors}
        required={true}
        data={sexData}
       />

      <Select
        name="city"
        register={register}
        value={watch("city")}
        error={errors}
        required={true}
        data={cities}
      />

      <Select
        name="speciality"
        title="Doctor Speciality"
        register={register}
        value={watch("speciality")}
        error={errors}
        data={specialities}
      />

      <Select
        name="doctor"
        register={register}
        value={watch("doctor")}
        error={errors}
        required={true}
        data={doctorsWithInfo}
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

      <button type="submit" className='button is-success is-light'>
        Submit
      </button>
     </form>

      <DevTool control={control} />
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
