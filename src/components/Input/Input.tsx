/* eslint-disable import/no-unused-modules */
import React, { KeyboardEventHandler } from 'react'
import classNames from 'classnames'

import { FieldErrors, UseFormRegister } from 'react-hook-form'
import { Inputs } from 'types/Inputs'
import { DataFormat } from 'types/Validation'

type Props = {
  type: string,
  name: keyof Inputs,
  placeholder?: string,
  register: UseFormRegister<Inputs>,
  error: FieldErrors<Inputs>,
  defaultValue?: string,
  pattern?: DataFormat,
  onKeyPress?: KeyboardEventHandler<HTMLInputElement> | undefined,
  max?: number,
  required?: boolean
}

export const Input: React.FC<Props> = ({
  type = 'text',
  name,
  placeholder,
  register,
  error,
  defaultValue = '',
  pattern,
  onKeyPress = undefined,
  max,
  required = false,
}) => {
  const nameUpperCase = name[0].toUpperCase() + name.slice(1);

  return (
    <label>
      <div>
        <span className={classNames(
          'required',
          { 'required--invisible': !required }
        )}>*</span>
        <span>{nameUpperCase}</span>
      </div>

      <input
        defaultValue={defaultValue}
        className={classNames(
          "input",
          { 'error-container': error[name as keyof FieldErrors<Inputs>] }
        )}
        type={type}
        placeholder={placeholder ? placeholder : name}
        {...register(name, {
          required: {
            value: required,
            message: name === 'email' || name === 'mobile number'
              ? `Email or Mobile number is required`
              : `${nameUpperCase} is required`,
          },

          pattern,
        })}
        onKeyPress={onKeyPress}
        maxLength={max}
      />

      <p className='error'>{ error[name as keyof FieldErrors<Inputs>]?.message}</p>
    </label>
  )
}
