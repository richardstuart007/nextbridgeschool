'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Typography } from '@mui/material'
import styles from './RegisterPwd.module.css'
//
//  services
//
import writeUsersPwd from '@/services/dbApi/writeUsersPwd'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
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
  // State
  //
  const [form_message, setForm_message] = useState('')
  //
  //  BackgroundColor
  //
  const [BACKGROUNDCOLOR_FORMPAPER, SetBACKGROUNDCOLOR_FORMPAPER] = useState('purple')
  const [BACKGROUNDCOLOR_MYINPUT, SetBACKGROUNDCOLOR_MYINPUT] = useState('purple')
  //
  //  Interface to Form
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])
  //
  //  Every Time
  //
  useEffect(() => {
    clientEveryTime()
  })
  //...........................................................................
  // First Time
  //...........................................................................
  function clientFirstTime() {
    //
    //  Debug Settings
    //
    debugLog = debugSettings()
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientFirstTime'))
    //
    //  Application Environment Variables
    //
    const App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env '), App_Env)
    //
    //  BackgroundColor
    //
    SetBACKGROUNDCOLOR_FORMPAPER(App_Env.BACKGROUNDCOLOR_FORMPAPER)
    SetBACKGROUNDCOLOR_MYINPUT(App_Env.BACKGROUNDCOLOR_MYINPUT)
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientEveryTime() {
    try {
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
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
      <div className={styles.pageContent}>
        <div className={styles.container}>
          <MyForm>
            <Paper
              sx={{
                margin: 1,
                padding: 1,
                maxWidth: 400,
                backgroundColor: BACKGROUNDCOLOR_FORMPAPER,
              }}
            >
              {/*.................................................................................................*/}

              <Typography variant='h6' style={{ color: 'blue', margin: 1 }}>
                Register Password
              </Typography>

              {/*.................................................................................................*/}

              <MyInput
                name='user'
                label='Registration User'
                value={values.user}
                onChange={handleInputChange}
                error={errors.user}
                sx={{ backgroundColor: BACKGROUNDCOLOR_MYINPUT, minWidth: '300px', margin: 2 }}
              />

              {/*.................................................................................................*/}

              <MyInput
                name='password'
                label='password'
                value={values.password}
                onChange={handleInputChange}
                error={errors.password}
                sx={{ backgroundColor: BACKGROUNDCOLOR_MYINPUT, minWidth: '300px', margin: 2 }}
              />

              {/*.................................................................................................*/}

              <Typography style={{ color: 'red', margin: 2 }}>{form_message}</Typography>

              {/*.................................................................................................*/}

              <MyButton
                text='Continue'
                onClick={() => {
                  FormSubmit()
                }}
              />
            </Paper>
            {/*.................................................................................................*/}

            <MyButton
              color='warning'
              onClick={() => {
                router.push('/Signin')
              }}
              text='Back'
            />

            {/*.................................................................................................*/}
          </MyForm>
        </div>
      </div>
    </>
  )
}
