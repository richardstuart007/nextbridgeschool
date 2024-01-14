'use client'
//
//  Libraries
//
import { useState, useEffect } from 'react'
import { Paper, Grid, Typography } from '@mui/material'
//
//  Utilities
//
import apiAxios from '../../utilities/apiAxios'
import writeSession from '../../services/writeSession'
//
//  Controls
//
import MyButton from '../../components/controls/MyButton'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug
//
let debugLog
const debugModule = 'Splash'
//===================================================================================
export default function Splash() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), App_Env)
  //
  // State
  //
  const [form_message, setForm_message] = useState('')
  const [showContinue, setshowContinue] = useState(false)
  const [showConnect, setshowConnect] = useState(false)
  const router = useRouter()
  //
  //  Screen Width
  //
  const ScreenSmall = JSON.parse(sessionStorage.getItem('App_ScreenSmall'))
  //
  //  Say Hello to server
  //
  useEffect(() => {
    sayHello(false)
    // eslint-disable-next-line
  }, [])
  //...................................................................................
  //.  Check Server is responding
  //...................................................................................
  function sayHello(signin) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'sayHello'))
    //
    //  Check if errors
    //
    const App_Server = JSON.parse(sessionStorage.getItem('App_Server'))
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
      if (!signin) {
        setForm_message('')
        setshowContinue(true)
      }
    })
  }
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  async function Hello() {
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
        AxTable: 'dbstats'
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
        AxInfo: info
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
        rtnRows: []
      }
      return rtnObj
    }
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
          elevation: 12
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
              Email: richardstuart007@hotmail.com
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
              <MyButton
                type='submit'
                text='Retry Connection'
                value='Submit'
                onClick={() => sayHello(true)}
              />
            </Grid>
          ) : null}
          {/*.................................................................................................*/}
          {showContinue ? (
            <Grid item xs={12}>
              <MyButton
                type='submit'
                text='Register/Signin'
                value='Submit'
                onClick={() => {
                  writeSession()
                  router?.push('/Signin')
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
