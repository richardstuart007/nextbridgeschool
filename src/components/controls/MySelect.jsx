//
//  Libraries
//
import React from 'react'
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material'
//=====================================================================================
export default function MySelect(props) {
  //
  //  Deconstruct
  //
  const {
    name,
    label,
    value,
    className,
    error = null,
    onChange,
    options,
    backgroundColor = 'azure',
    ...other
  } = props

  return (
    <FormControl
      variant='outlined'
      sx={{ backgroundColor: backgroundColor, minWidth: '300px', margin: 1.5 }}
      {...(error && { error: true })}
      {...other}
    >
      <InputLabel>{label}</InputLabel>
      <Select label={label} name={name} value={value} onChange={onChange} {...other}>
        {options.map(item => (
          <MenuItem key={item.id} value={item.id}>
            {item.title}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
