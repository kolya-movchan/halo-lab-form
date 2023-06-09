/* eslint-disable import/no-unused-modules */
import React, { Fragment } from 'react'
import classNames from 'classnames';

import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { Inputs } from 'types/Inputs';

type Props = {
  parameter: keyof Inputs,
  title?: string,
  register: UseFormRegister<Inputs>,
  value: string,
  error: FieldErrors<Inputs>,
  required?: boolean,
  data: string[],
};

export const Select: React.FC<Props> = ({
  parameter,
  title,
  register,
  value = '',
  error,
  required = false,
  data,
}) => {
  const name = parameter[0].toUpperCase() + parameter.slice(1);

  return (
    <label>
      <div>
        {required && (
          <span className='required'>*</span>
        )}
        <span>{title ? title : name}</span>
      </div>

      <div className="select"
      >
        <select
          className={classNames(
            { 'error-container': error[parameter as keyof FieldErrors<Inputs>] }
        )}
          value={value}
          {...register(parameter, {
            required: {
              value: required,
              message: `${name} is required`
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

      <p className='error'>{ error[parameter as keyof FieldErrors<Inputs>]?.message}</p>
    </label>
  )
}
