'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Typography } from '@mui/material'
import styles from './Splash.module.css'
//
//  services
//
import apiAxios from '/src//services/dbApi/apiAxios'
import writeSession from '/src//services/dbApi/writeSession'
import apiCreateOptions from '/src//services/dbApi/apiCreateOptions'
import sessionStorageGet from '/src//services/sessionStorage/sessionStorageGet'
//
//  Controls
//
import MyButton from '/src//components/Controls/MyButton'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'Splash'
//
//  Global Variables
//
let App_Env
let App_URL
let App_Session
//
//  Constants
//
import { CONST_DEFAULT, BACKGROUNDCOLOR_FORMPAPER } from '/src//services/appInit/AppConstants'
//===================================================================================
export default function Splash() {
  //
  // State
  //
  const [connection_message, setconnection_message] = useState('')
  const [server_message, setserver_message] = useState('')
  const [database_message, setdatabase_message] = useState('')
  const [showContinue, setshowContinue] = useState(false)
  const [showConnect, setshowConnect] = useState(false)
  const [ScreenSmall, setScreenSmall] = useState(false)
  //
  //  BackgroundColor
  //
  const [BackgroudColor_FORMPAPER, SetBackgroudColor_FORMPAPER] =
    useState(BACKGROUNDCOLOR_FORMPAPER)
  const router = useRouter()
  //
  //  First Time
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])
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
    //  BackgroundColor
    //
    if (
      process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER &&
      process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER !== CONST_DEFAULT
    )
      SetBackgroudColor_FORMPAPER(process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER)
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
    //
    //  Initial connection
    //
    sayHello()
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
    if (!App_Server) {
      setserver_message('Invalid App_Server Setup parameters')
      return
    }
    setserver_message(`Server: ${App_Server}`)
    //
    //  Check if errors
    //
    const App_Database = sessionStorageGet({ caller: debugModule, itemName: 'App_Database' })
    if (!App_Database) {
      setdatabase_message('Invalid App_Database Setup parameters')
      return
    }
    setdatabase_message(`Database: ${App_Database}`)
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
        const message = 'No response from the Server'
        setconnection_message(message)
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
        setconnection_message(message)
        setshowConnect(true)
        return
      }
      //-----------------
      //  OK
      //-----------------
      //
      //  Reset User Info
      //
      sessionStorage.removeItem('User_Password')
      sessionStorage.removeItem('User_Userspwd')
      //
      //  Write Session info (if not already exists)
      //
      getSession()
      if (!App_Session) writeSession()
      //
      //  Create Options
      //
      createOptionsOwner()
      //
      //  Connected
      //
      setshowContinue(true)
      //
      //  Connection message
      //
      connectionMessage()
    })
  }
  //--------------------------------------------------------------------
  //-  Get the session ID
  //--------------------------------------------------------------------
  function getSession() {
    //
    //  Session
    //
    App_Session = sessionStorageGet({ caller: debugModule, itemName: 'App_Session' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Session'), App_Session)
    //
    //  Connection message
    //
    if (App_Session) {
      setconnection_message(`Connected (${App_Session.v_vid})`)
    } else {
      setconnection_message(`Connected`)
    }
  }
  //--------------------------------------------------------------------
  //-  Attempt to get session info
  //--------------------------------------------------------------------
  function connectionMessage() {
    //
    //  Session already exists
    //
    if (App_Session) return
    //
    //  First Attempt
    //
    let attempts = 0
    attemptToGetSession()
    //
    //  Wait to try again, Increase the delay with each attempt
    //
    function attemptToGetSession() {
      setTimeout(() => {
        getSession()
        attempts++
        //
        //  Schedule the next attempt
        //
        if (!App_Session && attempts < 5) {
          attemptToGetSession()
        }
      }, 500 * attempts)
    }
  }
  //--------------------------------------------------------------------
  //-  Check The Server/Database
  //--------------------------------------------------------------------
  async function Hello() {
    //
    //  Get the URL
    //
    App_URL = sessionStorageGet({ caller: debugModule, itemName: 'App_URL' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_URL'), App_URL)
    //
    //  Try server connection
    //
    setconnection_message(`Connecting to Server`)
    //
    // Fetch the data
    //
    try {
      //
      //  Setup actions
      //
      const body = {
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
      cop_store: 'App_Data_Options_Owner',
    })
  }
  //...................................................................................
  //.  Render the form
  //...................................................................................
  return (
    <>
      <div className={styles.pageContent}>
        <div className={styles.container}>
          <Paper
            sx={{
              backgroundColor: BackgroudColor_FORMPAPER,
              elevation: 12,
              padding: 2,
            }}
          >
            {/*.................................................................................................*/}

            <Typography variant='h6' style={{ color: 'blue' }} margin={1}>
              Splash Information
            </Typography>
            {/*.................................................................................................*/}

            <Typography variant='subtitle2' margin={1}>
              Developed by Richard Stuart
            </Typography>
            {/*.................................................................................................*/}
            {ScreenSmall ? (
              <Typography
                variant='subtitle2'
                margin={1}
                sx={{ color: 'blue', backgroundColor: 'yellow' }}
              >
                Restricted Functionality on a SMALL screen
              </Typography>
            ) : null}
            {/*.................................................................................................*/}
            <Typography style={{ color: 'red' }} margin={1}>
              {connection_message}
            </Typography>
            <Typography style={{ color: 'green' }} margin={1}>
              {server_message}
            </Typography>
            <Typography style={{ color: 'green' }} margin={1}>
              {database_message}
            </Typography>
            {/*.................................................................................................*/}
            {showConnect ? (
              <MyButton
                text='Retry Connection'
                margin={1}
                value='Submit'
                onClick={() => sayHello()}
              />
            ) : null}
            {/*.................................................................................................*/}
            {showContinue ? (
              <MyButton
                text='Continue'
                value='Submit'
                margin={1}
                onClick={() => {
                  router.push('/Signin')
                }}
              />
            ) : null}
            {/*.................................................................................................*/}
          </Paper>
        </div>
      </div>
    </>
  )
}
