'use client'
//
//  Libraries
//
import { useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import apiAxios from '@/utilities/apiAxios'
import buildDataUser from '@/services/buildDataUser'
//
//  Controls
//
import MyButton from '@/components/controls/MyButton'
import MyInput from '@/components/controls/MyInput'
import { useMyForm, MyForm } from '@/components/controls/useMyForm'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug
//
const debugLog = debugSettings()
const debugModule = 'Signin'
//
//  Initial Values
//
const initialFValues = {
  user: '',
  password: ''
}
//...................................................................................
//.  Main Line
//...................................................................................
export default function Signin() {
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showButtons, setShowButtons] = useState(true)
  const router = useRouter()
  //
  //  Interface to Form
  //
  const { values, errors, setErrors, handleInputChange } = useMyForm(initialFValues, true, validate)
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Restore previous signin info
    //
    const User_User = JSON.parse(sessionStorage.getItem('User_User'))
    if (User_User) initialFValues.user = User_User.u_user
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
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
      ...temp
    })
    if (fieldValues === values) return Object.values(temp).every(x => x === '')
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function FormSubmit(e) {
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
    const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
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
        password: password
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
        AxInfo: info
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
        rtnRows: []
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
    sessionStorage.setItem('User_User', JSON.stringify(userRow))
    sessionStorage.setItem('User_UserSwitch', JSON.stringify(false))
    sessionStorage.setItem('User_Owners', JSON.stringify(userownerRows))
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
    sessionStorage.setItem('User_OwnersString', JSON.stringify(ownersString))
    //
    //  Signed In
    //
    sessionStorage.setItem('User_SignedIn', true)
    //
    //  Build User Data into Storage
    //
    buildDataUser()
    //
    //  Start Page
    //
    router?.push('/Library')
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
            backgroundColor: 'whitesmoke'
          }}
        >
          <Grid container spacing={1} justify='center' alignItems='center' direction='column'>
            {/*.................................................................................................*/}
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='h6' style={{ color: 'blue' }}>
                SignIn
              </Typography>
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='user'
                label='Registered user'
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
            {showButtons ? (
              <Grid item xs={12}>
                <MyButton
                  text='SignIn'
                  onClick={() => {
                    FormSubmit()
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
        </Paper>
        {/*.................................................................................................*/}
        {showButtons ? (
          <Grid item xs={12}>
            <MyButton
              color='warning'
              onClick={() => {
                router?.push('/Register')
              }}
              text='Register'
            />
          </Grid>
        ) : null}
        {/*.................................................................................................*/}
      </MyForm>
    </>
  )
}
