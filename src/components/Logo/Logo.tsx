import classNames from 'classnames'
import React from 'react'

type Props = {
  isSuccess: boolean,
}

export const Logo: React.FC<Props> = ({ isSuccess }) => {
  return (
    <div className={classNames(
      'logo-container',
      { 'logo-container--success': isSuccess }
    )}>

     <img
       src="./halo-lab-logo.svg"
       alt="halo-lab"
       className="logo"
     />
   </div>
  )

}
