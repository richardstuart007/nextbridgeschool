'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Typography } from '@mui/material'
import styles from './RegisterUser.module.css'
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
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
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
let App_Env
//
//  Constants
//
import { BACKGROUNDCOLOR_FORMPAPER, BACKGROUNDCOLOR_MYINPUT } from '@/services/appInit/AppConstants'
//...................................................................................
//.  Main Line
//...................................................................................
export default function RegisterUser() {
  const router = useRouter()
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showButtonUpdate, setShowButtonUpdate] = useState(false)
  const [App_Data_Options_Owner, setApp_Data_Options_Owner] = useState([
    { id: 'id', title: 'title' },
  ])
  const [u_user, setu_user] = useState('')
  const [password, setpassword] = useState('')
  const [u_uid, setu_uid] = useState(0)
  //
  //  BackgroundColor
  //
  const [BackgroundColor_FORMPAPER, SetBackgroundColor_FORMPAPER] =
    useState(BACKGROUNDCOLOR_FORMPAPER)
  const [BackgroundColor_MYINPUT, SetBackgroundColor_MYINPUT] = useState(BACKGROUNDCOLOR_MYINPUT)
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
  //
  //  Interface to Form
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
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
    App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env '), App_Env)
    //
    //  BackgroundColor
    //
    SetBackgroundColor_FORMPAPER(App_Env.BACKGROUNDCOLOR_FORMPAPER)
    SetBackgroundColor_MYINPUT(App_Env.BACKGROUNDCOLOR_MYINPUT)
    //
    //  Userpwd info
    //
    const User_Userspwd = sessionStorageGet({ caller: debugModule, itemName: 'User_Userspwd' })
    setu_uid(User_Userspwd.upuid)
    setu_user(User_Userspwd.upuser)
    //
    //  Password
    //
    setpassword(sessionStorageGet({ caller: debugModule, itemName: 'User_Password' }))
    //
    //  Default in Owner
    //
    const updValues = { ...values }
    updValues.ogowner = App_Env.DFT_USER_OWNER
    setValues(updValues)
    //
    //  Define the Store
    //
    const w_App_Data_Options_Owner = sessionStorageGet({
      caller: debugModule,
      itemName: 'App_Data_Options_Owner',
    })
    if (debugLog)
      console.log(consoleLogTime(debugModule, 'App_Data_Options_Owner'), App_Data_Options_Owner)
    setApp_Data_Options_Owner(w_App_Data_Options_Owner)
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientEveryTime() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientEveryTime'))
    try {
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
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
    //  Go to Signin
    //
    router.push('/Signin')
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
      <div className={styles.pageContent}>
        <div className={styles.container}>
          <MyForm>
            <Paper
              sx={{
                margin: 1,
                padding: 1,
                maxWidth: 400,
                backgroundColor: BackgroundColor_FORMPAPER,
              }}
            >
              {/*.................................................................................................*/}
              <Typography variant='h6' style={{ color: 'blue', margin: 1 }}>
                User Information
              </Typography>
              {/*.................................................................................................*/}
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h6' style={{ color: 'green', margin: 1 }}>
                  User
                </Typography>
                <Typography variant='h6' style={{ color: 'red', margin: 1, paddingLeft: 4 }}>
                  {u_user}
                </Typography>
              </span>
              {/*.................................................................................................*/}
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h6' style={{ color: 'green', margin: 1 }}>
                  Password
                </Typography>
                <Typography variant='h6' style={{ color: 'red', margin: 1, paddingLeft: 4 }}>
                  {password}
                </Typography>
              </span>
              {/*.................................................................................................*/}
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant='h6' style={{ color: 'green', margin: 1 }}>
                  Id
                </Typography>
                <Typography variant='h6' style={{ color: 'red', margin: 1, paddingLeft: 4 }}>
                  {u_uid}
                </Typography>
              </span>
              {/*.................................................................................................*/}
              <MyInput
                name='u_name'
                label='name'
                value={values.u_name}
                onChange={handleInputChange}
                error={errors.u_name}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px', margin: 1.5 }}
              />
              {/*.................................................................................................*/}
              <MyInput
                name='u_email'
                label='email'
                value={values.u_email}
                onChange={handleInputChange}
                error={errors.u_email}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px', margin: 1.5 }}
              />
              {/*.................................................................................................*/}
              <MySelect
                key={App_Data_Options_Owner.id}
                name='ogowner'
                label='Owner'
                value={values.ogowner}
                onChange={handleInputChange}
                error={errors.ogowner}
                backgroundColor={BackgroundColor_MYINPUT}
                options={App_Data_Options_Owner}
              />
              {/*.................................................................................................*/}
              <SelectCountry
                label='Bridge Federation Country'
                onChange={handleSelectCountry}
                countryCode={values.u_fedcountry}
              />
              {/*.................................................................................................*/}
              <MyInput
                name='u_fedid'
                label='Bridge Federation Id'
                value={values.u_fedid}
                onChange={handleInputChange}
                error={errors.u_fedid}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px', margin: 1.5 }}
              />
              {/*.................................................................................................*/}
              <Typography style={{ color: 'red', margin: 1.5 }}>{form_message}</Typography>
              {/*.................................................................................................*/}
              {showButtonUpdate ? (
                <MyButton
                  text='Update'
                  onClick={() => {
                    FormSubmit()
                  }}
                />
              ) : null}
            </Paper>
            {/*.................................................................................................*/}
          </MyForm>
        </div>
      </div>
    </>
  )
}
