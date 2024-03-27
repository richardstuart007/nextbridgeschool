'use client'
//
//  Libraries
//
import React, { useEffect, useState } from 'react'
import { Paper, Grid } from '@mui/material'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
import MyInput from '@/components/Controls/MyInput'
import MyCheckbox from '@/components/Controls/MyCheckbox'
import PageHeader from '@/components/Controls/PageHeader'
import { useMyForm, MyForm } from '@/components/Controls/useMyForm'
//
//  Services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'UsersSettings'
//
//  Form Initial Values
//
const initialFValues = {
  u_name: '',
  u_email: '',
  u_showprogress: true,
  u_showscore: true,
  u_sortquestions: true,
  u_skipcorrect: true,
  u_dftmaxquestions: 5,
  u_fedcountry: '',
  u_fedid: '',
}
//
//  Constants
//
import { BACKGROUNDCOLOR_FORMPAPER, BACKGROUNDCOLOR_MYINPUT } from '@/services/appInit/AppConstants'
//...................................................................................
//.  Main Line
//...................................................................................
export default function UsersSettings() {
  const router = useRouter()
  //
  //  State
  //
  const [ScreenSmall, setScreenSmall] = useState(false)
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
    SetBackgroundColor_FORMPAPER(App_Env.BACKGROUNDCOLOR_FORMPAPER)
    SetBackgroundColor_MYINPUT(App_Env.BACKGROUNDCOLOR_MYINPUT)
    //
    //  Small Screen overrides
    //
    const w_ScreenSmall = sessionStorageGet({ caller: debugModule, itemName: 'App_ScreenSmall' })
    setScreenSmall(w_ScreenSmall)
    if (debugLog) console.log(consoleLogTime(debugModule, 'w_ScreenSmall'), w_ScreenSmall)
    //
    //  Get User
    //
    const recordForEdit = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_User',
    })
    //
    //  Update form values
    //
    setValues({
      ...recordForEdit,
    })
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
  //...................................................................................
  //
  // Validate the fields
  //
  const validate = (fieldValues = values) => {
    //
    //  Load previous errors
    //
    let errorsUpd = { ...errors }
    //
    //  Validate current field
    //
    if ('u_name' in fieldValues)
      errorsUpd.u_name = fieldValues.u_name === '' ? 'This field is required.' : ''
    //
    //  email
    //
    if ('email' in fieldValues) {
      errorsUpd.u_email = validateEmail(fieldValues.u_email) ? '' : 'Email is not a valid format'
    }
    //
    //  MaxQuestions
    //
    if ('u_dftmaxquestions' in fieldValues)
      errorsUpd.u_dftmaxquestions =
        parseInt(fieldValues.u_dftmaxquestions) > 0 && parseInt(fieldValues.u_dftmaxquestions) <= 50
          ? ''
          : `You must select between 1 and 50.`
    //
    //  Set the errors
    //
    setErrors({
      ...errorsUpd,
    })
    //
    //  Check if every element within the errorsUpd object is blank, then return true (valid), but only on submit when the fieldValues=values
    //
    if (fieldValues === values) {
      return Object.values(errorsUpd).every(x => x === '')
    }
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
  //
  //  UseMyForm
  //
  const { values, setValues, errors, setErrors, handleInputChange } = useMyForm(
    initialFValues,
    true,
    validate
  )
  //...................................................................................
  //.  Submit form
  //...................................................................................
  const handleSubmit = () => {
    //
    //  Validate & Update
    //
    if (validate()) {
      const { ...UpdateValues } = { ...values }
      //
      //  Store
      //
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_User',
        itemValue: UpdateValues,
      })
      //
      //  Update database
      //
      updateRowData(UpdateValues)
      //
      //  return to previous
      //
      router.back()
    }
  }
  //.............................................................................
  //.  UPDATE
  //.............................................................................
  const updateRowData = data => {
    //
    //  Strip out KEY as it is not updated
    //
    let { u_user, ...nokeyData } = data
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'users',
      AxAction: 'UPDATE',
      AxWhere: `u_user = '${u_user}'`,
      AxRow: nokeyData,
    }
    const myPromiseUpdate = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseUpdate.then(function (rtnObj) {
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      const data = rtnObj.rtnRows
      //
      //  Get u_user
      //
      const rtn_u_user = data[0].u_user
      if (debugLog)
        console.log(consoleLogTime(debugModule, `Row (${rtn_u_user}) UPDATED in Database`))
      return
    })
    return myPromiseUpdate
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      {/* .......................................................................................... */}
      {ScreenSmall ? null : <PageHeader title='User Settings' subTitle='Change User Preferences' />}
      {/* .......................................................................................... */}
      <MyForm>
        <Paper
          sx={{
            margin: 2,
            padding: 0,
            maxWidth: 400,
            backgroundColor: BackgroundColor_FORMPAPER,
            elevation: 12,
          }}
        >
          <Grid
            container
            spacing={2}
            justifyContent='flex-start'
            alignItems='flex-start'
            direction='column'
          >
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyInput
                name='u_name'
                label='Name'
                value={values.u_name}
                onChange={handleInputChange}
                error={errors.u_name}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px' }}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyInput
                name='u_email'
                label='Email'
                value={values.u_email}
                onChange={handleInputChange}
                error={errors.u_email}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px' }}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyInput
                name='u_fedcountry'
                label='Bridge Federation Country'
                value={values.u_fedcountry}
                onChange={handleInputChange}
                error={errors.u_fedcountry}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '200px' }}
              />
            </Grid>
            <Grid item xs={12}>
              <MyInput
                name='u_fedid'
                label='Bridge Federation ID'
                value={values.u_fedid}
                onChange={handleInputChange}
                error={errors.u_fedid}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '300px' }}
              />
            </Grid>

            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyInput
                name='u_dftmaxquestions'
                label='Default Maximum Questions'
                value={values.u_dftmaxquestions}
                onChange={handleInputChange}
                error={errors.u_dftmaxquestions}
                sx={{ backgroundColor: BackgroundColor_MYINPUT, minWidth: '200px' }}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyCheckbox
                name='u_showprogress'
                label='Show Linear Progress'
                value={values.u_showprogress}
                onChange={handleInputChange}
                error={errors.u_showprogress}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyCheckbox
                name='u_showscore'
                label='Show Linear Score'
                value={values.u_showscore}
                onChange={handleInputChange}
                error={errors.u_showscore}
              />
            </Grid>

            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyCheckbox
                name='u_sortquestions'
                label='Sort Questions'
                value={values.u_sortquestions}
                onChange={handleInputChange}
                error={errors.u_sortquestions}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyCheckbox
                name='u_skipcorrect'
                label='Skip Correct Answers'
                value={values.u_skipcorrect}
                onChange={handleInputChange}
                error={errors.u_skipcorrect}
              />
            </Grid>
            {/*------------------------------------------------------------------------------ */}
            <Grid item xs={12}>
              <MyButton
                text='Update'
                color='primary'
                variant='contained'
                onClick={() => handleSubmit()}
              />
            </Grid>
          </Grid>
        </Paper>
        {/* .......................................................................................... */}
        <Grid item xs={12}>
          <MyButton
            text='Back'
            color='warning'
            onClick={() => {
              router.back()
            }}
          />
        </Grid>
        {/* .......................................................................................... */}
      </MyForm>
    </>
  )
}
