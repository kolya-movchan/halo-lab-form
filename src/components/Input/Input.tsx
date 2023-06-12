import React, { KeyboardEventHandler } from 'react'
import { FieldErrors, UseFormRegister } from 'react-hook-form'
import classNames from 'classnames'

import { Inputs } from 'types/Inputs'
import { DataFormat } from 'types/Validation'

type Props = {
  type: string,
  name: keyof Inputs,
  placeholder?: string,
  register: UseFormRegister<Inputs>,
  error: FieldErrors<Inputs>,
  defaultValue?: string,
  pattern: DataFormat,
  onKeyPress?: KeyboardEventHandler<HTMLInputElement> | undefined,
  max?: number,
  required: boolean
}

export const Input: React.FC<Props> = ({
  type = 'text',
  name,
  placeholder,
  register,
  error,
  defaultValue = '',
  pattern,
  onKeyPress,
  max,
  required = false,
}) => {
  const nameUpperCase = name[0].toUpperCase() + name.slice(1);

  return (
    <label className='label'>
      <div>
        <span
          className={classNames(
            'required',
            { 'required--invisible': !required }
          )}
        >
          *
        </span>

        <span className='span'>{nameUpperCase}</span>
      </div>

      <input
        defaultValue={defaultValue}
        type={type}
        placeholder={placeholder ? placeholder : name}
        maxLength={max}
        onKeyPress={onKeyPress}
        className={classNames(
          "input",
          { 'error-container': error[name as keyof FieldErrors<Inputs>] }
        )}
        {...register(name, {
          required: {
            value: required,
            message: name === 'email' || name === 'mobile number'
              ? `Email or Mobile number is required`
              : `${nameUpperCase} is required`,
          },
          pattern,
        })}
      />

      <p className='error'>
        {error[name as keyof FieldErrors<Inputs>]?.message}
      </p>
    </label>
  )
}
