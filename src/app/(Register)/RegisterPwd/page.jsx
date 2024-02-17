'use client'
//
//  Libraries
//
import React, { useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  services
//
import writeUsersPwd from '@/services/dbApi/writeUsersPwd'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
import MyInput from '@/components/Controls/MyInput'
import { useMyForm, MyForm } from '@/components/Controls/useMyForm'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'RegisterPwd'
//.............................................................................
//.  Data Input Fields
//.............................................................................
//
//  Initial Values
//
const initialFValues = {
  user: '',
  password: '',
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function RegisterPwd() {
  const router = useRouter()
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  //
  //  Interface to Form
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //.............................................................................
  //.  Input field validation
  //.............................................................................
  function validate(fieldValues = values) {
    let temp = { ...errors }
    //
    //  user
    //
    if ('user' in fieldValues) {
      temp.user = fieldValues.user.length !== 0 ? '' : 'This field is required.'
      if (fieldValues.user.length !== 0) {
        const noSpacesText = fieldValues.user.replace(/\s/g, '')
        if (fieldValues.user !== noSpacesText) {
          const updValues = { ...fieldValues }
          updValues.user = noSpacesText
          setValues(updValues)
        }
      }
    }
    //
    //  password
    //
    if ('password' in fieldValues) {
      temp.password = fieldValues.password.length !== 0 ? '' : 'This field is required.'
      if (fieldValues.password.length !== 0) {
        const noSpacesText = fieldValues.password.replace(/\s/g, '')
        if (fieldValues.password !== noSpacesText) {
          const updValues = { ...fieldValues }
          updValues.password = noSpacesText
          setValues(updValues)
        }
      }
    }
    //
    //  Set the errors
    //
    setErrors({
      ...temp,
    })

    if (fieldValues === values) return Object.values(temp).every(x => x === '')
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function FormSubmit() {
    if (validate()) {
      FormUpdate()
    }
  }
  //...................................................................................
  //.  Update
  //...................................................................................
  function FormUpdate() {
    //
    //  Deconstruct values
    //
    const { user, password } = values
    //
    //  Save the password locally
    //

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Password',
      itemValue: password,
    })
    //
    //  Process promise
    //
    const params = {
      AxCaller: debugModule,
      user: user,
      password: password,
    }
    const myPromiseRegisterPwd = writeUsersPwd(params)
    //
    //  Resolve Status
    //
    myPromiseRegisterPwd.then(function (rtnObj) {
      //
      //  Valid ?
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
      const rtnValue = rtnObj.rtnValue
      if (rtnValue) {
        const Userspwd = rtnObj.rtnRows[0]
        sessionStorageSet({
          caller: debugModule,
          itemName: 'User_Userspwd',
          itemValue: Userspwd,
        })
        router.push('/RegisterUser')
      } else {
        //
        //  Error
        //
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        setForm_message(message)
      }
      return
    })
    return myPromiseRegisterPwd
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <MyForm>
        <Paper
          sx={{
            margin: 1,
            padding: 1,
            maxWidth: 400,
            backgroundColor: 'whitesmoke',
          }}
        >
          <Grid
            container
            spacing={1}
            justify='center'
            alignItems='center'
            direction='column'
            style={{ minheight: '100vh' }}
          >
            {/*.................................................................................................*/}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='h6' style={{ color: 'blue' }}>
                Register User & Password
              </Typography>
            </Grid>

            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='user'
                label='Registration User'
                value={values.user}
                onChange={handleInputChange}
                error={errors.user}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='password'
                label='password'
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
                sx={{ minWidth: '300px' }}
              />
            </Grid>

            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <Typography style={{ color: 'red' }}>{form_message}</Typography>
            </Grid>

            {/*.................................................................................................*/}

            <Grid item xs={12}>
              <MyButton
                text='Continue'
                onClick={() => {
                  FormSubmit()
                }}
              />
            </Grid>
          </Grid>
        </Paper>
        {/*.................................................................................................*/}

        <Grid item xs={12}>
          <MyButton
            color='warning'
            onClick={() => {
              router.push('/Signin')
            }}
            text='Back'
          />
        </Grid>

        {/*.................................................................................................*/}
      </MyForm>
    </>
  )
}
