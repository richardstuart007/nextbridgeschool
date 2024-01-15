'use client'
import React from 'react'
import styles from './navbar.module.css'
import DarkModeToggle from '@/components/DarkModeToggle/DarkModeToggle'
import { signOut, useSession } from 'next-auth/react'
import { usePathname } from 'next/navigation'
//
//  Libraries
//
import { Grid } from '@mui/material'
//
//  Icons
//
import ScoreboardIcon from '@mui/icons-material/Scoreboard'
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications'
import LogoutIcon from '@mui/icons-material/Logout'
import SwitchAccountIcon from '@mui/icons-material/SwitchAccount'
//
//  Common Components
//
import Layout from '@/components/Layout/Layout'
//
//  Components
//
import MyActionButton from '@/components/controls/MyActionButton'
//
//  Routing
//
import { useRouter } from 'next/navigation'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Debug Settings
//
const debugLog = debugSettings()
const debugModule = 'Navbar'

export default function Navbar() {
  const session = useSession()
  const router = useRouter()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //...........................................................................
  // Module STATE
  //...........................................................................
  let showButton_Library
  let buttonTextSignout = 'Signout'
  let buttonTextSettings = 'Settings'
  let showButton_UsersSettings
  let showButton_QuizHistory
  let User_Admin = false
  let showButton_SwitchUser
  let showButton_Signout
  const PageCurrent = usePathname()
  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Try
  //
  try {
    //
    //  Change of Page ?
    //
    const Nav_Page_Current = JSON.parse(sessionStorage.getItem('Nav_Page_Current'))
    if (PageCurrent !== Nav_Page_Current) {
      sessionStorage.setItem('Nav_Page_Previous', JSON.stringify(Nav_Page_Current))
      sessionStorage.setItem('Nav_Page_Current', JSON.stringify(PageCurrent))
    }
    const User_SignedIn = JSON.parse(sessionStorage.getItem('User_SignedIn'))
    //
    //  Small screen
    //
    const ScreenSmall = JSON.parse(sessionStorage.getItem('App_ScreenSmall'))
    if (ScreenSmall) {
      buttonTextSignout = null
      buttonTextSettings = null
    }
    //
    //  Show SignOut Button ?
    //
    User_SignedIn ? (showButton_Signout = true) : (showButton_Signout = false)
    //
    //  Show Settings Button ?
    //
    User_SignedIn && (PageCurrent === '/QuizHistory' || PageCurrent === '/Library')
      ? (showButton_UsersSettings = true)
      : (showButton_UsersSettings = false)
    //
    //  Show History Button ?
    //
    User_SignedIn &&
    PageCurrent !== '/QuizHistory' &&
    PageCurrent !== '/QuizHistoryDetail' &&
    PageCurrent !== '/UsersSettings' &&
    PageCurrent !== '/Quiz'
      ? (showButton_QuizHistory = true)
      : (showButton_QuizHistory = false)
    //
    //  Show Library Button ?
    //
    User_SignedIn &&
    PageCurrent !== '/Library' &&
    PageCurrent !== '/Quiz' &&
    PageCurrent !== '/UsersSettings'
      ? (showButton_Library = true)
      : (showButton_Library = false)
    //
    //  Show SwitchUser Button ?
    //
    if (User_SignedIn) {
      const User_User = JSON.parse(sessionStorage.getItem('User_User'))
      User_Admin = User_User.u_admin
    }
    let User_UserSwitch = false
    const User_UserSwitchJSON = sessionStorage.getItem('User_UserSwitch')
    if (User_UserSwitchJSON) User_UserSwitch = JSON.parse(User_UserSwitchJSON)

    User_SignedIn && !ScreenSmall && (User_Admin || User_UserSwitch)
      ? (showButton_SwitchUser = true)
      : (showButton_SwitchUser = false)
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  return (
    <div className={styles.container}>
      <Layout />
      <div className={styles.links}>
        <DarkModeToggle />
        <div>
          <Grid container alignItems='center'>
            {/* .......................................................................................... */}

            {showButton_Library ? (
              <MyActionButton
                startIcon={<ScoreboardIcon fontSize='small' />}
                color='warning'
                onClick={() => router.push('/Library')}
                text='Library'
              ></MyActionButton>
            ) : null}
            {/* .......................................................................................... */}

            {showButton_QuizHistory ? (
              <MyActionButton
                startIcon={<ScoreboardIcon fontSize='small' />}
                color='warning'
                onClick={() => router.push('/QuizHistory')}
                text='History'
              ></MyActionButton>
            ) : null}
            {/* .......................................................................................... */}
            {showButton_UsersSettings ? (
              <MyActionButton
                startIcon={<SettingsApplicationsIcon fontSize='small' />}
                color='warning'
                onClick={() => router.push('/UsersSettings')}
                text={buttonTextSettings}
              ></MyActionButton>
            ) : null}

            {/* .......................................................................................... */}
            {showButton_SwitchUser ? (
              <MyActionButton
                startIcon={<SwitchAccountIcon fontSize='small' />}
                color='warning'
                onClick={() => router.push('/SwitchUser')}
                text='Switch User'
              ></MyActionButton>
            ) : null}
            {/* .......................................................................................... */}
            {showButton_Signout ? (
              <MyActionButton
                startIcon={<LogoutIcon fontSize='small' />}
                color='warning'
                onClick={() => {
                  const OwnersString = JSON.parse(sessionStorage.getItem('User_OwnersString'))
                  sessionStorage.setItem('User_OwnersString_Prev', JSON.stringify(OwnersString))
                  router.push('/Signin')
                }}
                text={buttonTextSignout}
              ></MyActionButton>
            ) : null}
            {/* .......................................................................................... */}
          </Grid>
        </div>
      </div>
      {session.status === 'authenticated' && (
        <button className={styles.logout} onClick={signOut}>
          Logout
        </button>
      )}
    </div>
  )
}
