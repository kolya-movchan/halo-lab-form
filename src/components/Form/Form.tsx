import React from 'react'
import { useForm, SubmitHandler } from "react-hook-form";

type Inputs = {
  example: string,
  exampleRequired: string,
  sex: string,
  city: string,
  speciality: string,
  doctorName: string,
  email: string,
};

export const Form: React.FC = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);

  console.log(watch("example")) // watch input value by passing the name of it
  // console.log(watch("exampleRequired")) // watch input value by passing the name of it

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>
        <span>Name</span>

        <input
          defaultValue=""
          className="input"
          type="text"
          placeholder='name'
          // {...register("example")}
        />
      </label>

      <label>
        <span>Email</span>

        <input
          defaultValue=""
          className="input"
          type="email"
          placeholder='email'
          // {...register("email")}
        />
      </label>

      <label>
        <span>Date</span>

        <input type='date' {...register("exampleRequired", { required: true })} className="input" />
        {/* errors will return when field validation fails  */}
        {errors.exampleRequired && <span>This field is required</span>}
      </label>

      <label>
        <span>Sex</span>

        <div className="select">
          <select {...register("sex")} value="" >
            <option value="" disabled>Choose</option>
            <option value="male">male</option>
            <option value="female">female</option>
          </select>
        </div>
      </label>

        <label>
          <span>City</span>

          <div className="select">
            <select {...register("city")} value="">
              <option value="" disabled>Choose</option>
              <option value="Kyiv">Kyiv</option>
              <option value="Lviv">Lviv</option>
            </select>
          </div>
        </label>

      <label>
        <span>Speciality</span>

        <div className="select">
          <select {...register("speciality")} value="">
            <option value="" disabled>Choose</option>
            <option value="Dentist">Dentist</option>
            <option value="Nurse">Nurse</option>
          </select>
        </div>
      </label>

      <label>
        <span>Doctor</span>

        <div className="select">
          <select {...register("doctorName")} value="">
            <option value="" disabled>Choose</option>
            <option value="Michael">Michael</option>
            <option value="Jane">Jane</option>
          </select>
        </div>
      </label>

      <button type="submit" className='button is-success is-light' disabled>
        Submit
      </button>
    </form>
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
