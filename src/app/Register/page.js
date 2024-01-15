'use client'
//
//  Libraries
//
import { useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import registerUser from '@/services/registerUser'
//
//  Controls
//
import MyButton from '@/components/controls/MyButton'
import MyInput from '@/components/controls/MyInput'
import { useMyForm, MyForm } from '@/components/controls/useMyForm'
import SelectCountry from '@/components/controls/SelectCountry'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
let debugLog
const debugModule = 'Register'
//.............................................................................
//.  Data Input Fields
//.............................................................................
//
//  Initial Values
//
const initialFValues = {
  name: '',
  fedid: '',
  fedcountry: 'NZ',
  user: '',
  email: '',
  password: ''
}
//...................................................................................
//.  Main Line
//...................................................................................
function Register() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const router = useRouter()
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showButtons, setShowButtons] = useState(true)
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
    //  name
    //
    if ('name' in fieldValues) {
      temp.name = fieldValues.name.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  user
    //
    if ('user' in fieldValues) {
      temp.user = fieldValues.user.length !== 0 ? '' : 'This field is required.'
    }
    //
    //  email
    //
    if ('email' in fieldValues) {
      temp.email = validateEmail(fieldValues.email) ? '' : 'Email is not a valid format'
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
  function validateEmail(email) {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
  }
  //...................................................................................
  //.  Form Submit
  //...................................................................................
  function FormSubmit(e) {
    if (validate()) {
      FormUpdate()
    }
  }
  //...................................................................................
  //.  Update
  //...................................................................................
  function FormUpdate() {
    //
    //  User message
    //
    setForm_message('Registration in progress please WAIT..')
    //
    //  Hide signin button
    //
    setShowButtons(false)
    //
    //  Deconstruct values
    //
    const { name, user, email, password, fedid, fedcountry } = values
    //
    //  Process promise
    //
    const params = {
      AxCaller: debugModule,
      user: user,
      email: email,
      password: password,
      name: name,
      fedid: fedid,
      fedcountry: fedcountry,
      dftmaxquestions: App_Env.DFT_USER_MAXQUESTIONS,
      dftowner: App_Env.DFT_USER_OWNER,
      showprogress: App_Env.DFT_USER_SHOWPROGRESS,
      showscore: App_Env.DFT_USER_SHOWSCORE,
      sortquestions: App_Env.DFT_USER_SORTQUESTIONS,
      skipcorrect: App_Env.DFT_USER_SKIPCORRECT,
      admin: false,
      dev: false
    }
    const myPromiseRegister = registerUser(params)
    //
    //  Resolve Status
    //
    myPromiseRegister.then(function (rtnObj) {
      //
      //  Valid ?
      //
      const rtnValue = rtnObj.rtnValue
      if (rtnValue) {
        const Usersrow = rtnObj.rtnRows[0]
        setForm_message(`Data updated in Database with ID(${Usersrow.u_uid})`)
        sessionStorage.setItem('User_User', JSON.stringify(Usersrow))
        router.push('/Signin')
      } else {
        //
        //  Error
        //
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        setForm_message(message)
        //
        //  Show button
        //
        setShowButtons(true)
      }
      return
    })
    return myPromiseRegister
  }
  //...................................................................................
  //.  Select Country
  //...................................................................................
  function handleSelectCountry(CountryCode) {
    //
    //  Populate Country Object & change country code
    //
    const updValues = { ...values }
    updValues.u_fedcountry = CountryCode
    //
    //  Update values
    //
    setValues(updValues)
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
                Registration Page
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
            <Grid item xs={12} sx={{ mt: 2 }}>
              <Typography variant='subtitle2' style={{ color: 'blue' }}>
                Your Details
              </Typography>
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='name'
                label='name'
                value={values.name}
                onChange={handleInputChange}
                error={errors.name}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='email'
                label='email'
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
                sx={{ minWidth: '300px' }}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='fedid'
                label='Bridge Federation Id'
                value={values.fedid}
                onChange={handleInputChange}
                error={errors.fedid}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <SelectCountry
                label='Bridge Federation Country'
                onChange={handleSelectCountry}
                countryCode={values.u_fedcountry}
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
                  text='Register'
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
                router.push('/Signin')
              }}
              text='Signin'
            />
          </Grid>
        ) : null}
        {/*.................................................................................................*/}
      </MyForm>
    </>
  )
}

export default Register
