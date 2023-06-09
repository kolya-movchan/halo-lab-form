/* eslint-disable import/no-unused-modules */
import React, { Fragment } from 'react'
import classNames from 'classnames';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Inputs } from 'types/Inputs';

type Props = {
  name: keyof Inputs,
  title?: string,
  register: UseFormRegister<Inputs>,
  value: string,
  error: FieldErrors<Inputs>,
  required?: boolean,
  data: string[],
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
            { 'error-container': error[name as keyof FieldErrors<Inputs>] }
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
            {data.map(item => {
              return (
                <Fragment key={item}>
                  <option value={item}>{item}</option>
                </Fragment>
                )
            })}
        </select>
      </div>

      <p className='error'>{ error[name as keyof FieldErrors<Inputs>]?.message}</p>
    </label>
  )
}
