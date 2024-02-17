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
import AppInit from '@/services/appInit/AppInit'
import Splash from '@/app/Splash'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
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

  console.log('ScreenMedium', ScreenMedium)
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
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Client
    //
    setisClient(true)
  }
}
