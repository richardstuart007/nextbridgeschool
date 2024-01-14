//
//  Libraries
//
import { useState } from 'react'
//=====================================================================================
//=  useMyForm
//=====================================================================================
export function useMyForm(initialFValues, validateOnChange = false, validate) {
  //
  //  State
  //
  const [values, setValues] = useState(initialFValues)
  const [errors, setErrors] = useState({})
  //...................................................................................
  //
  //  Handle change and Validate
  //
  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
    if (validateOnChange) validate({ [name]: value })
  }
  //...................................................................................
  //
  //  Reset the form to Initial Values
  //
  const resetForm = () => {
    setValues(initialFValues)
    setErrors({})
  }
  //...................................................................................
  //
  //  Return Values
  //
  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  }
}
//=====================================================================================
//=  MyForm
//=====================================================================================
//
//  MyForm
//
export function MyForm(props) {
  const { children, ...other } = props
  return (
    <form autoComplete='off' {...other}>
      {props.children}
    </form>
  )
}
