//
//  Libraries
//
import React from 'react'
import { Button } from '@mui/material'
//=====================================================================================
export default function MyButton(props) {
  const {
    text,
    variant = 'contained',
    size = 'small',
    color = 'primary',
    onClick,
    ...other
  } = props

  return (
    <Button variant={variant} size={size} color={color} onClick={onClick} {...other}>
      {text}
    </Button>
  )
}
