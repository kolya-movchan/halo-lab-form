/* eslint-disable import/no-unused-modules */
import React from 'react'
import classNames from 'classnames'

import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Inputs } from 'types/Inputs'

type Props = {
  type: string,
  value: keyof Inputs,
  register: UseFormRegister<Inputs>,
  error: FieldErrors<Inputs>,
  defaultValue?: string,
}

export const Input: React.FC<Props> = ({
  type = 'text',
  value,
  register,
  error,
  defaultValue = '',
}) => {
  const name = value[0].toUpperCase() + value.slice(1);

  return (
    <label>
      <div>
        <span className='required'>*</span>
        <span>{name}</span>
      </div>

      <input
        defaultValue={defaultValue}
        className={classNames(
          "input",
          { 'error-container': error[value as keyof FieldErrors<Inputs>] }
        )}
        type={type}
        placeholder={value}
        {...register(value, {
          required: {
            value: true,
            message: `${name} is required`
          }
        })}
      />

      <p className='error'>{ error[value as keyof FieldErrors<Inputs>]?.message}</p>
    </label>
  )
}
