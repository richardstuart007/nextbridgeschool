'use client'
import React, { useState, useEffect } from 'react'
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
import NavbarHeader from './NavbarHeader/NavbarHeader'
import MyActionButton from '@/components/Controls/MyActionButton'
// import sessionStorageSet from '@/services/sessionStorageSet'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
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
const debugModule = 'Navbar'
//...........................................................................
// Module Main Line
//...........................................................................
export default function Navbar() {
  const session = useSession()
  const router = useRouter()
  //
  //  Current Page
  //
  const PageCurrent = usePathname()
  //
  //  State
  //
  const [User_SignedIn, setUser_SignedIn] = useState(false)
  const [ScreenSmall, setScreenSmall] = useState(false)
  const [buttonTextSignout, setbuttonTextSignout] = useState('Signout')
  const [buttonTextSettings, setbuttonTextSettings] = useState('Settings')
  const [showButton_QuizHistory, setshowButton_QuizHistory] = useState(false)
  const [showButton_Library, setshowButton_Library] = useState(false)
  const [showButton_UsersSettings, setshowButton_UsersSettings] = useState(false)
  const [User_Admin, setUser_Admin] = useState(false)
  const [showButton_SwitchUser, setshowButton_SwitchUser] = useState(false)
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
    //  Small screen
    //
    const w_ScreenSmall = sessionStorageGet({ caller: debugModule, itemName: 'App_ScreenSmall' })
    setScreenSmall(w_ScreenSmall)

    if (ScreenSmall) {
      setbuttonTextSignout(null)
      setbuttonTextSettings(null)
    }
  }
  //...........................................................................
  // Client Code
  //...........................................................................
  function clientLoad() {
    try {
      //
      //  User Signed In ?
      //
      const w_User_SignedIn = sessionStorageGet({ caller: debugModule, itemName: 'User_SignedIn' })
      setUser_SignedIn(w_User_SignedIn)
      //
      //  Show Settings Button ?
      //
      User_SignedIn && (PageCurrent === '/QuizHistory' || PageCurrent === '/Library')
        ? setshowButton_UsersSettings(true)
        : setshowButton_UsersSettings(false)
      //
      //  Show History Button ?
      //
      User_SignedIn &&
      PageCurrent !== '/QuizHistory' &&
      PageCurrent !== '/QuizHistoryDetail' &&
      PageCurrent !== '/UsersSettings' &&
      PageCurrent !== '/Quiz'
        ? setshowButton_QuizHistory(true)
        : setshowButton_QuizHistory(false)
      //
      //  Show Library Button ?
      //
      User_SignedIn &&
      PageCurrent !== '/Library' &&
      PageCurrent !== '/Quiz' &&
      PageCurrent !== '/UsersSettings'
        ? setshowButton_Library(true)
        : setshowButton_Library(false)
      //
      //  Show SwitchUser Button ?
      //
      if (User_SignedIn) {
        const User_User = sessionStorageGet({ caller: debugModule, itemName: 'User_User' })
        setUser_Admin(User_User.u_admin)
      }
      const User_UserSwitch = sessionStorageGet({
        caller: debugModule,
        itemName: 'User_UserSwitch',
      })

      User_SignedIn && !ScreenSmall && (User_Admin || User_UserSwitch)
        ? setshowButton_SwitchUser(true)
        : setshowButton_SwitchUser(false)
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...........................................................................
  return (
    <div className={styles.container}>
      <NavbarHeader />
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
            {User_SignedIn ? (
              <MyActionButton
                startIcon={<LogoutIcon fontSize='small' />}
                color='warning'
                onClick={() => {
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
