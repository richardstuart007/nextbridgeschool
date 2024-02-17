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
          bgcolor: 'yellow',
        },
      }}
      onClick={onClick}
      {...other}
    >
      {children}
    </MyButton>
  )
}
