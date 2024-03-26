'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Typography } from '@mui/material'
import styles from './Signin.module.css'
//
//  services
//
import apiAxios from '@/services/dbApi/apiAxios'
import buildDataUser from '@/services/builds/buildDataUser'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
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
const debugModule = 'Signin'
//
//  Initial Values
//
const initialFValues = {
  user: '',
  password: '',
}
//
let App_Env
//...................................................................................
//.  Main Line
//...................................................................................
export default function Signin() {
  const router = useRouter()
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showButtons, setShowButtons] = useState(true)
  //
  //  Interface to Form
  //
  const { values, errors, setErrors, handleInputChange } = useMyForm(initialFValues, true, validate)
  //
  //  BackgroundColor
  //
  const [BACKGROUNDCOLOR_FORMPAPER, SetBACKGROUNDCOLOR_FORMPAPER] = useState('purple')
  const [BACKGROUNDCOLOR_MYINPUT, SetBACKGROUNDCOLOR_MYINPUT] = useState('purple')
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
    App_Env = sessionStorageGet({
      caller: debugModule,
      itemName: 'App_Env',
    })
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientEveryTime'))
    try {
      //
      //  Restore previous signin info
      //
      const User_User = sessionStorageGet({
        caller: debugModule,
        itemName: 'User_User',
      })
      if (User_User) initialFValues.user = User_User.u_user
      //
      //  Userpwd info
      //
      const User_Userspwd = sessionStorageGet({ caller: debugModule, itemName: 'User_Userspwd' })
      if (User_Userspwd) initialFValues.user = User_Userspwd.upuser
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //.............................................................................
  //.  Input field validation
  //.............................................................................
  function validate(fieldValues = values) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'validate'))
    let temp = { ...errors }
    //
    //  user
    //
    if ('user' in fieldValues) {
      temp.user = fieldValues.user.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  password
    //
    if ('password' in fieldValues) {
      temp.password = fieldValues.password.length !== 0 ? '' : 'This field is required.'
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'FormSubmit'))
    if (validate()) {
      FormUpdate()
    }
  }
  //...................................................................................
  //.  Update
  //...................................................................................
  function FormUpdate() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'FormUpdate'))
    //
    //  Hide signin button
    //
    setShowButtons(false)
    //
    //  Check the user/pwd
    //
    const myPromiseSignin = checkSignin()
    //
    //  Resolve Status
    //
    myPromiseSignin.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), rtnObj)
      //
      //  Error
      //
      const rtnValue = rtnObj.rtnValue
      if (!rtnValue) {
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        if (debugLog) console.log(consoleLogTime(debugModule, 'Error Message'), message)
        setForm_message(message)
        //
        //  Show button
        //
        setShowButtons(true)
        return
      }
      //
      //  SignIn
      //
      ProcessSignIn(rtnObj)
    })
  }
  //--------------------------------------------------------------------
  //-  Check the User/Pwd
  //--------------------------------------------------------------------
  async function checkSignin() {
    //
    //  User message
    //
    setForm_message('Validating please WAIT..')
    //
    //  Deconstruct values
    //
    const { user, password } = values
    //
    //  Get the URL
    //
    const App_URL = sessionStorageGet({
      caller: debugModule,
      itemName: 'App_URL',
    })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_URL'), App_URL)
    let body
    //
    // Fetch the data
    //
    try {
      //
      //  Setup actions
      //
      body = {
        AxClient: debugModule,
        AxTable: 'users',
        user: user,
        password: password,
      }
      const URL = App_URL + App_Env.URL_SIGNIN
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      //
      //  Info
      //
      const info = `Client(${debugModule}) Action(Signin)`
      //
      //  SQL database
      //
      const apiAxiosProps = {
        AxUrl: URL,
        AxData: body,
        AxInfo: info,
      }
      const rtnObj = await apiAxios(apiAxiosProps)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), { ...err })
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: [],
      }
      return rtnObj
    }
  }
  //...................................................................................
  //.  Process User Signin
  //...................................................................................
  function ProcessSignIn(rtnObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'ProcessSignIn'))
    //
    //  Form Message
    //
    setForm_message('Signin being processed')
    //
    //  User Row
    //
    const userRow = rtnObj.rtnRows[0]
    //
    //  User owner rows
    //
    const userownerRows = rtnObj.rtnRows[1]
    //
    //  User Info
    //

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_User',
      itemValue: userRow,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_UserSwitch',
      itemValue: false,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Owners',
      itemValue: userownerRows,
    })
    //
    //  Userowners string
    //
    let ownersString = `'${App_Env.DFT_USER_OWNER}'`
    if (userownerRows && userownerRows.length > 0) {
      ownersString = ''
      for (let i = 0; i < userownerRows.length; i++) {
        const uoowner = userownerRows[i].uoowner
        if (i > 0) ownersString = ownersString + `, `
        ownersString = ownersString + `'${uoowner}'`
      }
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'ownersString'), ownersString)
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_OwnersString',
      itemValue: ownersString,
    })
    //
    //  Signed In
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_SignedIn',
      itemValue: true,
    })
    //
    //  Build User Data into Storage
    //
    buildDataUser()
    //
    //  Start Page
    //
    router.push('/Library')
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
                padding: 2,
                margin: 2,
                maxWidth: 400,
                backgroundColor: BACKGROUNDCOLOR_FORMPAPER,
              }}
            >
              {/*.................................................................................................*/}

              <Typography variant='h6' style={{ color: 'blue', margin: 1 }}>
                SignIn
              </Typography>

              {/*.................................................................................................*/}

              <MyInput
                name='user'
                label='Registered user'
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
              {showButtons ? (
                <MyButton
                  text='SignIn'
                  onClick={() => {
                    FormSubmit()
                  }}
                />
              ) : null}
            </Paper>
            {/*.................................................................................................*/}
            {showButtons ? (
              <MyButton
                color='warning'
                onClick={() => {
                  router.push('/RegisterPwd')
                }}
                text='Register'
              />
            ) : null}
            {/*.................................................................................................*/}
          </MyForm>
        </div>
      </div>
    </>
  )
}
