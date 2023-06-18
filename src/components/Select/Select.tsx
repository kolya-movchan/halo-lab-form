import React, { Fragment } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import classNames from 'classnames';

import { Inputs } from 'types/Inputs';
import { City } from 'types/City';
import { Sex } from 'types/Sex';
import { Speciality } from 'types/Speciality';

type Props = {
  name: keyof Inputs,
  register: UseFormRegister<Inputs>,
  value: string,
  error: FieldErrors<Inputs>,
  required?: boolean,
  data: City[] | Sex[] | Speciality[],
};

export const Select: React.FC<Props> = ({
  name,
  register,
  value = '',
  error,
  required = false,
  data,
}) => {
  const nameUpperCase = name[0].toUpperCase() + name.slice(1);
  const indexName = name as keyof FieldErrors<Inputs>;

  return (
    <label className='label'>
      <div>
        {required && (
          <span className='required'>*</span>
        )}

        <span className='span'>{nameUpperCase}</span>
      </div>

      <div className="select">
        <select
          value={value}
          className={classNames(
            'selectLocal',
            { 'error-container': error[indexName] }
          )}
          {...register(name, {
            required: {
              value: required,
              message: `${nameUpperCase} is required`
            }
          })}
        >
          <option value="" disabled>
            {data?.length > 0 ? 'Choose' : '--'}
          </option>

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

      <p className='error'>
        {error[indexName]?.message}
      </p>
    </label>
  )
}
