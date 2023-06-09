import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";
import { DevTool } from '@hookform/devtools';

type Inputs = {
  name: string,
  date: string,
  sex: string,
  city: string,
  speciality: string,
  doctorName: string,
  email: string,
  phone: string,
};

export const Form: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors }, control } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  console.log(watch("name"))

  return (
    <>
     <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <label>
        <div>
          <span className='required'>*</span>
          <span>Name</span>
        </div>

        <input
          defaultValue=""
          className="input"
          type="text"
          placeholder='name'
          {...register("name", {
            required: {
              value: true,
              message: 'Name is required'
            }
          })}
        />
      </label>

      <label>
        <div>
          <span className='required'>*</span>
          <span>Date</span>
        </div>

        <input
          type='date'
          className="input"
          {...register("date", {
            required: {
              value: true,
              message: 'Date is required'
            }
          })}
        />
        {/* {errors.date && <span>This field is required</span>} */}
      </label>

      <label>
        <div>
          <span className='required'>*</span>
          <span>Sex</span>
        </div>

        <div className="select">
          <select
            value=""
            {...register("sex", {
              required: {
                value: true,
                message: 'Sex is required'
              }
            })}
          >
            <option value="" disabled>Choose</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>
      </label>

        <label>
          <div>
            <span className='required'>*</span>
            <span>City</span>
          </div>

          <div className="select">
            <select
              value=""
              {...register("city", {
                required: {
                  value: true,
                  message: 'City is required'
                }
              })}
            >
              <option value="" disabled>Choose</option>
              <option value="Kyiv">Kyiv</option>
              <option value="Lviv">Lviv</option>
            </select>
          </div>
        </label>

      <label>
        <span>Doctor Speciality</span>

        <div className="select">
          <select {...register("speciality")} value="">
            <option value="" disabled>Choose</option>
            <option value="Dentist">Dentist</option>
            <option value="Nurse">Nurse</option>
          </select>
        </div>
      </label>

      <label>
        <div>
          <span className='required'>*</span>
          <span>Doctor</span>
        </div>

        <div className="select">
        <select
          value=""
          {...register("doctorName", {
            required: {
              value: true,
              message: 'Doctor is required'
            }
          })}
        >
            <option value="" disabled>Choose</option>
            <option value="Michael">Michael</option>
            <option value="Jane">Jane</option>
          </select>
        </div>
      </label>

      <label>
        <div>
          <span className='required'>*</span>
          <span>Email</span>
        </div>

        <input
          defaultValue=""
          className="input"
          type="email"
          placeholder='email'
          {...register("email", {
            required: {
              value: true,
              message: 'Email is required'
            }
          })}
        />
      </label>

      <label>
        <div>
          <span className='required'>*</span>
          <span>Mobile number</span>
        </div>

        <input
          defaultValue="+380"
          className="input"
          type="tel"
          placeholder='Mobile number'
          {...register("phone", {
            required: {
              value: true,
              message: 'Phone is required'
            }
          })}
        />
      </label>

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
