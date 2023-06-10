/* eslint-disable import/no-unused-modules */
import React, { Fragment } from 'react'
import classNames from 'classnames';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Inputs } from 'types/Inputs';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';
import { DoctorWithInfo } from 'types/Doctor';

type Props = {
  name: keyof Inputs,
  title?: string,
  register: UseFormRegister<Inputs>,
  value: string,
  error: FieldErrors<Inputs>,
  required?: boolean,
  data?: City[] | Sex[] | Speciality[] | DoctorWithInfo[],
};

export const Select: React.FC<Props> = ({
  name,
  title,
  register,
  value = '',
  error,
  required = false,
  data,
}) => {
  const nameUpperCase = name[0].toUpperCase() + name.slice(1);
  const indexName = name as keyof FieldErrors<Inputs>;

  return (
    <label>
      <div>
        {required && (
          <span className='required'>*</span>
        )}
        <span>{title ? title : nameUpperCase}</span>
      </div>

      <div className="select">
        <select
          className={classNames(
            { 'error-container': error[indexName] }
        )}
          value={value}
          {...register(name, {
            required: {
              value: required,
              message: `${nameUpperCase} is required`
            }
          })}
        >
          <option value="" disabled>Choose</option>
            {data && data.map(item => {
              const { id, name } = item;

              if ('specialityId' in item) {
                const { surname, speciality } = item;

                return (
                  <Fragment key={id}>
                    <option value={name}>{name} {surname} - {speciality}</option>
                  </Fragment>
                )
              }

              return (
                <Fragment key={id}>
                  <option value={name}>{name}</option>
                </Fragment>
                )
            })}
        </select>
      </div>

      <p className='error'>{ error[indexName]?.message}</p>
    </label>
  )
}
