'use client'
//
//  Libraries
//
import React, { useEffect, useState } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  services
//
import writeUsers from '@/services/dbApi/writeUsers'
import writeUsersowner from '@/services/dbApi/writeUsersowner'
import SelectCountry from '@/services/SelectCountry/SelectCountry'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
import MyInput from '@/components/Controls/MyInput'
import MySelect from '@/components/Controls/MySelect'
import { useMyForm, MyForm } from '@/components/Controls/useMyForm'

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
const debugModule = 'RegisterUser'
//.............................................................................
//.  Data Input Fields
//.............................................................................
//
//  Initial Values
//
const initialFValues = {
  u_name: '',
  u_email: '',
  ogowner: '',
  u_fedcountry: 'NZ',
}
//
//  Valid form
//
let validForm = false
//...................................................................................
//.  Main Line
//...................................................................................
export default function RegisterUser() {
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
  const [showButtonUpdate, setShowButtonUpdate] = useState(false)
  const [showButtonSignin, setShowButtonSignin] = useState(false)
  //
  //  Interface to Form
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //
  //  Userpwd info
  //
  const User_Userspwd = sessionStorageGet({ caller: debugModule, itemName: 'User_Userspwd' })
  const u_uid = User_Userspwd.upuid
  const u_user = User_Userspwd.upuser
  //
  //  Password
  //
  const password = sessionStorageGet({ caller: debugModule, itemName: 'User_Password' })
  //
  //  Default in Owner
  //
  const App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
  useEffect(() => {
    const dftowner = App_Env.DFT_USER_OWNER
    const updValues = { ...values }
    updValues.ogowner = dftowner
    setValues(updValues)
    // eslint-disable-next-line
  }, [])
  //
  //  Define the Store
  //
  const Data_Options_Owner = sessionStorageGet({
    caller: debugModule,
    itemName: 'Data_Options_Owner',
  })
  //.............................................................................
  //.  Input field validation
  //.............................................................................
  function validate(newValue = values) {
    let errorsUpd = { ...errors }
    //
    //  u_name
    //
    if ('u_name' in newValue) {
      errorsUpd.u_name = newValue.u_name.length !== 0 ? '' : 'This field is required.'
    } else {
      errorsUpd.u_name = values.u_name === '' ? 'This field is required.' : ''
    }
    //
    //  u_email
    //
    if ('u_email' in newValue) {
      errorsUpd.u_email = validateEmail(newValue.u_email) ? '' : 'Email is not a valid format'
    } else {
      errorsUpd.u_email = values.u_email === '' ? 'This field is required.' : ''
    }
    //
    //  Set the errors
    //
    setErrors({
      ...errorsUpd,
    })
    //
    //  Valid flag
    //
    validForm = Object.values(errorsUpd).every(x => x === '')
    //
    //  Validate form
    //
    validForm ? setShowButtonUpdate(true) : setShowButtonUpdate(false)
    return validForm
  }
  //...................................................................................
  function validateEmail(u_email) {
    return String(u_email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
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
    //  User message
    //
    setForm_message('Registration in progress please WAIT..')
    //
    //  Hide signin button
    //
    setShowButtonUpdate(false)
    //
    //  Write User Record
    //
    process_writeUsers()
    //
    //  Write UserOwner
    //
    process_writeUsersOwner()
    //
    //  User message
    //
    setForm_message('Registration Completed')
    //
    //  Hide signin button
    //
    setShowButtonSignin(true)
  }
  //...................................................................................
  //.  Write User
  //...................................................................................
  function process_writeUsers() {
    //
    //  Deconstruct values
    //
    const { u_name, u_email, u_fedid, u_fedcountry } = values
    //
    //  Application Environment Variables
    //
    const u_showprogress = App_Env.DFT_USER_SHOWPROGRESS
    const u_showscore = App_Env.DFT_USER_SHOWSCORE
    const u_sortquestions = App_Env.DFT_USER_SORTQUESTIONS
    const u_skipcorrect = App_Env.DFT_USER_SKIPCORRECT
    const u_dftmaxquestions = App_Env.DFT_USER_MAXQUESTIONS
    const u_admin = false
    const u_dev = false
    //
    //  Process promise
    //
    const u_joined = new Date().toJSON()
    const params = {
      u_uid: u_uid,
      u_name: u_name,
      u_email: u_email,
      u_joined: u_joined,
      u_fedid: u_fedid,
      u_admin: u_admin,
      u_showprogress: u_showprogress,
      u_showscore: u_showscore,
      u_sortquestions: u_sortquestions,
      u_skipcorrect: u_skipcorrect,
      u_dftmaxquestions: u_dftmaxquestions,
      u_fedcountry: u_fedcountry,
      u_user: u_user,
      u_dev: u_dev,
    }
    const myPromiseUsersowner = writeUsers(params)
    //
    //  Resolve Status
    //
    myPromiseUsersowner.then(function (rtnObj) {
      //
      //  Valid ?
      //
      const rtnValue = rtnObj.rtnValue
      if (rtnValue) {
        const Users = rtnObj.rtnRows[0]
        sessionStorageSet({
          caller: debugModule,
          itemName: 'User_User',
          itemValue: Users,
        })
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
  }
  //...................................................................................
  //.  Write Usersowner
  //...................................................................................
  function process_writeUsersOwner() {
    //
    //  Deconstruct values
    //
    const { ogowner } = values
    //
    //  Process promise
    //
    const params = {
      uouid: u_uid,
      uouser: u_user,
      uoowner: ogowner,
    }
    const myPromiseUsersowner = writeUsersowner(params)
    //
    //  Resolve Status
    //
    myPromiseUsersowner.then(function (rtnObj) {
      //
      //  Error
      //
      const rtnValue = rtnObj.rtnValue
      if (!rtnValue) {
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        setForm_message(message)
      }
      return
    })
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
                Register User Information
              </Typography>
            </Grid>

            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='u_user'
                label='User'
                value={u_user}
                sx={{ minWidth: '300px' }}
                disabled
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='password'
                label='password'
                value={password}
                sx={{ minWidth: '300px' }}
                disabled
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='u_uid'
                label='User ID'
                value={u_uid}
                sx={{ minWidth: '300px' }}
                disabled
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='u_name'
                label='name'
                value={values.u_name}
                onChange={handleInputChange}
                error={errors.u_name}
                sx={{ minWidth: '300px' }}
                disabled={showButtonSignin}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='u_email'
                label='email'
                value={values.u_email}
                onChange={handleInputChange}
                error={errors.u_email}
                sx={{ minWidth: '300px' }}
                disabled={showButtonSignin}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MySelect
                key={Data_Options_Owner.id}
                name='ogowner'
                label='Owner'
                value={values.ogowner}
                onChange={handleInputChange}
                error={errors.ogowner}
                sx={{ minWidth: '300px' }}
                options={Data_Options_Owner}
                disabled={showButtonSignin}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <SelectCountry
                label='Bridge Federation Country'
                onChange={handleSelectCountry}
                countryCode={values.u_fedcountry}
                disabled={showButtonSignin}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <MyInput
                name='u_fedid'
                label='Bridge Federation Id'
                value={values.u_fedid}
                onChange={handleInputChange}
                error={errors.u_fedid}
                sx={{ minWidth: '300px' }}
                disabled={showButtonSignin}
              />
            </Grid>
            {/*.................................................................................................*/}
            <Grid item xs={12}>
              <Typography style={{ color: 'red' }}>{form_message}</Typography>
            </Grid>
            {/*.................................................................................................*/}
            {showButtonUpdate ? (
              <Grid item xs={12}>
                <MyButton
                  text='Update'
                  onClick={() => {
                    FormSubmit()
                  }}
                />
              </Grid>
            ) : null}
          </Grid>
        </Paper>
        {/*.................................................................................................*/}
        {showButtonSignin ? (
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
