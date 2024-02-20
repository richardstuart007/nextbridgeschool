//
//  Sub Components
//
import React from 'react'
import MyButton from './MyButton'
//=====================================================================================
export default function MyActionButton(props) {
  const { children, onClick, ...other } = props

  return (
    <MyButton
      sx={{
        ':hover': {
          backgroundColor: 'yellowgreen',
        },
      }}
      onClick={onClick}
      {...other}
    >
      {children}
    </MyButton>
  )
}
