'use client'
//
// Libraries
//
import React, { useEffect, useState } from 'react'
import { createTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
//
//  services
//
import AppInit from '/src/services/appInit/AppInit'
import Splash from '/src//app/Splash'
import sessionStorageSet from '/src//services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'Home'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Layout Theme
//
const theme = createTheme({})
//============================================================================
//= Exported Module
//============================================================================
export default function Home() {
  //
  //  Screen Width
  //
  const ScreenMedium = useMediaQuery(theme.breakpoints.up('sm'))

  // console.log('ScreenMedium', ScreenMedium)
  //
  //  Client
  //
  const [isClient, setisClient] = useState(false)
  const [ScreenSmall, setScreenSmall] = useState(false)
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  First Time Setup
  //
  useEffect(() => {
    clientFirstTime()
    // eslint-disable-next-line
  }, [])
  //
  //  Screen size
  //
  useEffect(() => {
    setScreenSmall(!ScreenMedium)
    sessionStorageSet({
      caller: debugModule,
      itemName: 'App_ScreenSmall',
      itemValue: !ScreenMedium,
    })
  }, [ScreenMedium])
  //
  //  Client/Server
  //
  if (isClient) {
    return <Splash />
  } else {
    return null
  }
  //...........................................................................
  // First Time
  //...........................................................................
  function clientFirstTime() {
    //
    //  Initialise App_Env
    //
    AppInit()
    //
    //  Debug Settings
    //
    debugLog = debugSettings()
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientFirstTime'))
    //
    //  Client
    //
    setisClient(true)
  }
}
