//
//  Libraries
//
import React from 'react'
import { TextField } from '@mui/material'
//=====================================================================================
export default function MyInput(props) {
  //
  //  Deconstruct
  //
  const { name, label, value, error = null, onChange, ...other } = props

  return (
    <TextField
      variant='outlined'
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...other}
      {...(error && { error: true, helperText: error })}
    />
  )
}
