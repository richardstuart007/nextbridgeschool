//
//  Libraries
//
import { TextField } from '@mui/material'

//=====================================================================================
export default function MyInput(props) {
  //
  //  Deconstruct
  //
  const { name, label, value, className, error = null, onChange, ...other } = props

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
