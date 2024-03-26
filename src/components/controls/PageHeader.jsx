//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Paper, Card, Typography } from '@mui/material'
import styles from './PageHeader.module.css'
//
//  Services
//
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'PageHeader'
//=====================================================================================
export default function PageHeader(props) {
  //
  //  Deconstruct the props
  //
  const { title, subTitle, icon } = props
  //
  //  BackgroundColor
  //
  const [BACKGROUNDCOLOR_PAGEHEAD, SetBACKGROUNDCOLOR_PAGEHEAD] = useState('brown')
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
    //  Application Environment Variables
    //
    const App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env '), App_Env)
    //
    //  BackgroundColor
    //
    SetBACKGROUNDCOLOR_PAGEHEAD(App_Env.BACKGROUNDCOLOR_PAGEHEAD)
  }
  //...................................................................................
  return (
    <Paper
      elevation={0}
      square
      sx={{
        backgroundColor: BACKGROUNDCOLOR_PAGEHEAD,
      }}
    >
      <div className={styles.pageHeader}>
        <Card>{icon}</Card>
        <div>
          <Typography variant='h6' component='div'>
            {title}
          </Typography>
          <Typography variant='subtitle2' component='div'>
            {subTitle}
          </Typography>
        </div>
      </div>
    </Paper>
  )
}
