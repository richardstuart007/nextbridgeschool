'use client'
//
//  Libraries
//
import React, { useState, useEffect } from 'react'
import { Typography, Grid } from '@mui/material'
import Image from 'next/image'
import styles from './navbarHeader.module.css'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
let debugLog = false
const debugModule = 'NavbarHeader'
//============================================================================
//= Exported Module
//============================================================================
export default function NavbarHeader() {
  const [App_Server, setApp_Server] = useState('')
  const [App_Database, setApp_Database] = useState('')
  const [User_SignedIn, setUser_SignedIn] = useState(false)
  const [User_Admin, setUser_Admin] = useState(false)
  const [User_Dev, setUser_Dev] = useState(false)
  const [User_Switched, setUser_Switched] = useState(false)
  const [User_Name, setUser_Name] = useState('')
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
    clientLoad()
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
    //  Initialise to Dev if local
    //
    const App_Env = sessionStorageGet({ caller: debugModule, itemName: 'App_Env' })
    if (App_Env?.NODE_ENV === 'development') setUser_Dev(true)
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientLoad() {
    try {
      //
      //  Client storage initialised ?
      //
      const w_App_Server = sessionStorageGet({ caller: debugModule, itemName: 'App_Server' })
      //
      //  Continue if initialised
      //
      if (w_App_Server) {
        //
        //  Add clientserver/database
        //
        setApp_Server(w_App_Server)
        const w_App_Database = sessionStorageGet({ caller: debugModule, itemName: 'App_Database' })
        setApp_Database(w_App_Database)
        //
        //  Signed in User
        //
        const w_User_SignedIn = sessionStorageGet({
          caller: debugModule,
          itemName: 'User_SignedIn',
        })
        setUser_SignedIn(w_User_SignedIn)
        if (User_SignedIn) {
          const w_User_User = sessionStorageGet({ caller: debugModule, itemName: 'User_User' })
          setUser_Name(w_User_User.u_name)
          setUser_Admin(w_User_User.u_admin)
          setUser_Dev(w_User_User.u_dev)

          const w_User_UserSwitch = sessionStorageGet({
            caller: debugModule,
            itemName: 'User_UserSwitch',
          })
          setUser_Switched(w_User_UserSwitch)
        }
      }
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div>
      <Grid container alignItems='center'>
        {/* .......................................................................................... */}
        <Grid item>
          <Image src='/cards.svg' width={35} height={35} className={styles.icon} alt='cards' />
        </Grid>
        {/* .......................................................................................... */}
        {User_SignedIn ? (
          <Grid item>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'inline' },
                color: 'red',
              }}
            >
              {User_Name}
            </Typography>
          </Grid>
        ) : null}
        {/* .......................................................................................... */}
        {User_Admin ? (
          <Grid item>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' },
              }}
            >
              ADMIN
            </Typography>
          </Grid>
        ) : null}
        {/* .......................................................................................... */}
        {User_Dev ? (
          <Grid item>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' },
              }}
            >
              DEV
            </Typography>
          </Grid>
        ) : null}
        {/* .......................................................................................... */}
        {User_Switched ? (
          <Grid item>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'purple' },
              }}
            >
              SWITCHED
            </Typography>
          </Grid>
        ) : null}
        {/* .......................................................................................... */}
        {User_Dev ? (
          <Grid item>
            <Typography
              sx={{ display: { xs: 'none', sm: 'inline' } }}
            >{` Server(${App_Server}) Database(${App_Database})`}</Typography>
          </Grid>
        ) : null}

        {/* .......................................................................................... */}
        <Grid item xs></Grid>
      </Grid>
    </div>
  )
}
