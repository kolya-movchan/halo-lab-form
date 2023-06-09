import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from '@hookform/devtools';
import { Input } from 'components/Input';
import { Inputs } from 'types/Inputs';
import { Select } from 'components/Select';

export const Form: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  const sexData = ['Male', 'Female'];
  const cities = ['Kyiv', 'Lviv'];
  const doctors = ['Dentist', 'Nurse'];
  const doctorsNames = ['Kenny', 'Will'];

  // console.log(watch("name"))

  return (
    <>
     <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Input
        type="text"
        value="name"
        register={register}
        error={errors}
      />

      <Input
        type="date"
        value="date"
        register={register}
        error={errors}
       />

      <Select
        parameter="sex"
        register={register}
        value=''
        error={errors}
        required={true}
        data={sexData}
       />

      <Select
        parameter="city"
        register={register}
        value=''
        error={errors}
        required={true}
        data={cities}
      />

      <Select
        parameter="speciality"
        title="Doctor Speciality"
        register={register}
        value=''
        error={errors}
        data={doctors}
      />

      <Select
        parameter="doctor"
        register={register}
        value=''
        error={errors}
        required={true}
        data={doctorsNames}
      />

      <Input
        type="email"
        value="email"
        register={register}
        error={errors}
       />

      <Input
        type="tel"
        value="mobile number"
        register={register}
        error={errors}
        defaultValue='+380'
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
