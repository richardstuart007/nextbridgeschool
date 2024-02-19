'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  services
//
import apiAxios from '@/services/dbApi/apiAxios'
import writeSession from '@/services/dbApi/writeSession'
import apiCreateOptions from '@/services/dbApi/apiCreateOptions'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Controls
//
import MyButton from '@/components/Controls/MyButton'
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
const debugModule = 'Splash'
let App_Env
//===================================================================================
export default function Splash() {
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showContinue, setshowContinue] = useState(false)
  const [showConnect, setshowConnect] = useState(false)
  const [ScreenSmall, setScreenSmall] = useState(false)
  const router = useRouter()
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Screen Width
    //
    const w_App_ScreenSmall = sessionStorageGet({
      caller: debugModule,
      itemName: 'App_ScreenSmall',
    })
    setScreenSmall(w_App_ScreenSmall)
    //
    //  Application Environment Variables
    //
    App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), App_Env)
    sayHello()
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
  //...................................................................................
  //.  Check Server is responding
  //...................................................................................
  function sayHello() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'sayHello'))
    //
    //  Check if errors
    //
    const App_Server = sessionStorageGet({ caller: debugModule, itemName: 'App_Server' })
    if (App_Server === 'Error') {
      setForm_message('Invalid Setup parameters')
      return
    }
    //
    //  Hide buttons
    //
    setshowContinue(false)
    setshowConnect(false)
    //-----------------
    //  Check SERVER
    //-----------------
    const myPromiseHelloServer = Hello()
    myPromiseHelloServer.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
      //
      //  Error - no rsponse from server
      //
      if (!rtnObj) {
        let message = 'No response from the Server'
        setForm_message(message)
        setshowConnect(true)
        return
      }
      //
      //  Error returned from the server
      //
      if (!rtnObj.rtnValue) {
        let message
        rtnObj.rtnCatch ? (message = rtnObj.rtnCatchMsg) : (message = rtnObj.rtnMessage)
        if (debugLog) console.log(consoleLogTime(debugModule, 'Error Message'), message)
        setForm_message(message)
        setshowConnect(true)
        return
      }
      //-----------------
      //  OK
      //-----------------
      createOptionsOwner()
      setForm_message('')
      setshowContinue(true)
    })
  }
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  async function Hello() {
    //
    //  Get the URL
    //
    const App_URL = sessionStorageGet({ caller: debugModule, itemName: 'App_URL' })
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
        AxTable: 'dbstats',
      }
      const URL = App_URL + App_Env.URL_HELLO
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      //
      //  Info
      //
      const info = `Client(${debugModule}) Action(Hello)`
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
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), err)
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
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  function createOptionsOwner() {
    apiCreateOptions({
      cop_AxTable: 'owner',
      cop_id: 'oowner',
      cop_title: 'otitle',
      cop_store: 'Data_Options_Owner',
      cop_received: 'Data_Options_Owner_Received',
    })
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <Paper
        sx={{
          margin: 3,
          padding: 1,
          maxWidth: 350,
          backgroundColor: 'whitesmoke',
          elevation: 12,
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
              Splash Information
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2'>Developed by Richard Stuart</Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'red' }}>
              ANY ISSUES please email me
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'red' }}>
              richardstuart007@hotmail.com
            </Typography>
          </Grid>

          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'green' }}>
              There are known issues with Registering
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'green' }}>
              Generic student users have been created
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'black' }}>
              student01, student02 ... student11
            </Typography>
          </Grid>
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography variant='subtitle2' sx={{ color: 'black' }}>
              password = s
            </Typography>
          </Grid>

          {/*.................................................................................................*/}
          {ScreenSmall ? (
            <Grid item xs={12}>
              <Typography variant='subtitle2' sx={{ color: 'blue', backgroundColor: 'yellow' }}>
                Restricted Functionality on a SMALL screen
              </Typography>
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
          <Grid item xs={12}>
            <Typography style={{ color: 'red' }}>{form_message}</Typography>
          </Grid>
          {/*.................................................................................................*/}
          {showConnect ? (
            <Grid item xs={12}>
              <MyButton text='Retry Connection' value='Submit' onClick={() => sayHello()} />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
          {showContinue ? (
            <Grid item xs={12}>
              <MyButton
                text='Register/Signin'
                value='Submit'
                onClick={() => {
                  writeSession()
                  router.push('/Signin')
                }}
              />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
        </Grid>
      </Paper>
    </>
  )
}
