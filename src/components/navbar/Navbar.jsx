'use client'
import React, { useState, useEffect } from 'react'
import styles from './Navbar.module.css'
import { AppBar, Toolbar, Typography, Box } from '@mui/material'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { usePathname, useRouter } from 'next/navigation'
//
//  Common Components
//
import MyButton from '@/components/Controls/MyButton'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
import DarkModeToggle from '@/components/Navbar/DarkModeToggle/DarkModeToggle'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'Navbar'
//
//  Constants
//
import { BACKGROUNDCOLOR_NAVBAR } from '@/services/appInit/AppConstants'
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
  const [App_Server, setApp_Server] = useState('')
  const [App_Database, setApp_Database] = useState('')
  const [User_SignedIn, setUser_SignedIn] = useState(false)
  const [User_Admin, setUser_Admin] = useState(false)
  const [User_Dev, setUser_Dev] = useState(false)
  const [User_UserSwitch, setUser_UserSwitch] = useState(false)
  const [User_Name, setUser_Name] = useState('')
  const [ScreenSmall, setScreenSmall] = useState(false)
  const [showButton_QuizHistory, setshowButton_QuizHistory] = useState(false)
  const [showButton_Library, setshowButton_Library] = useState(false)
  const [showButton_UsersSettings, setshowButton_UsersSettings] = useState(false)
  const [showButton_SwitchUser, setshowButton_SwitchUser] = useState(false)
  //
  //  BackgroundColor
  //
  const [BackgroundColor_Navbar, SetBackgroundColor_Navbar] = useState('purple')
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
    //  BackgroundColor
    //
    if (BACKGROUNDCOLOR_NAVBAR) SetBackgroundColor_Navbar(BACKGROUNDCOLOR_NAVBAR)
    if (process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_NAVBAR)
      SetBackgroundColor_Navbar(process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_NAVBAR)
    //
    //  Small screen
    //
    const w_ScreenSmall = sessionStorageGet({ caller: debugModule, itemName: 'App_ScreenSmall' })
    setScreenSmall(w_ScreenSmall)
  }
  //...........................................................................
  // Every Time
  //...........................................................................
  function clientEveryTime() {
    //
    //  Debug Settings
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'clientEveryTime'))
    try {
      //
      //  Server/Database
      //
      const w_App_Server = sessionStorageGet({ caller: debugModule, itemName: 'App_Server' })
      setApp_Server(w_App_Server)
      const w_App_Database = sessionStorageGet({
        caller: debugModule,
        itemName: 'App_Database',
      })
      setApp_Database(w_App_Database)
      //
      //  User Switched
      //
      const w_User_UserSwitch = sessionStorageGet({
        caller: debugModule,
        itemName: 'User_UserSwitch',
      })
      setUser_UserSwitch(w_User_UserSwitch)
      //
      //  Signed in User
      //
      const w_User_SignedIn = sessionStorageGet({
        caller: debugModule,
        itemName: 'User_SignedIn',
      })
      setUser_SignedIn(w_User_SignedIn)
      //
      //  Get User
      //
      if (w_User_SignedIn) {
        const w_User_User = sessionStorageGet({ caller: debugModule, itemName: 'User_User' })
        if (debugLog) console.log(consoleLogTime(debugModule, 'User_User'), w_User_User)
        setUser_Name(w_User_User.u_name)
        setUser_Admin(w_User_User.u_admin)
        setUser_Dev(w_User_User.u_dev)
      }
      //
      //  Show Settings Button ?
      //
      w_User_SignedIn && (PageCurrent === '/QuizHistory' || PageCurrent === '/Library')
        ? setshowButton_UsersSettings(true)
        : setshowButton_UsersSettings(false)
      //
      //  Show History Button ?
      //
      w_User_SignedIn &&
      PageCurrent !== '/QuizHistory' &&
      PageCurrent !== '/QuizHistoryDetail' &&
      PageCurrent !== '/UsersSettings' &&
      PageCurrent !== '/Quiz'
        ? setshowButton_QuizHistory(true)
        : setshowButton_QuizHistory(false)
      //
      //  Show Library Button ?
      //
      w_User_SignedIn &&
      PageCurrent !== '/Library' &&
      PageCurrent !== '/Quiz' &&
      PageCurrent !== '/UsersSettings'
        ? setshowButton_Library(true)
        : setshowButton_Library(false)
      //
      //  Show switched user ?
      //
      w_User_SignedIn && !ScreenSmall && (User_Admin || User_UserSwitch)
        ? setshowButton_SwitchUser(true)
        : setshowButton_SwitchUser(false)
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
    }
  }
  //...........................................................................
  function handleLogout() {
    //
    //  Reset User info
    //
    setUser_SignedIn(false)
    setUser_Admin(false)
    setUser_Dev(false)
    setUser_UserSwitch(false)
    //
    //  Reset User Storage
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_SignedIn',
      itemValue: false,
    })
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_UserSwitch',
      itemValue: false,
    })
    sessionStorage.removeItem('User_User')
    //
    //  Navigate to Signin
    //
    router.push('/Signin')
  }
  //...........................................................................
  return (
    <div className={styles.container}>
      <AppBar
        position='fixed'
        elevation={0}
        sx={{
          backgroundColor: BackgroundColor_Navbar,
        }}
      >
        <Toolbar className={styles.Toolbar}>
          <div className={styles.Navbar}>
            <div className={styles.left}>
              <div className={styles.leftcontainer}>
                {/* .......................................................................................... */}
                <Image
                  src='/cards.svg'
                  width={35}
                  height={35}
                  className={styles.icon}
                  alt='cards'
                />
                {/* .......................................................................................... */}
                {User_SignedIn ? (
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography
                      className={styles.headerText}
                      align='center'
                      sx={{
                        display: { xs: 'none', sm: 'inline' },
                        color: 'red',
                      }}
                    >
                      {User_Name}
                    </Typography>
                  </Box>
                ) : null}
                {/* .......................................................................................... */}
                {User_Admin ? (
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography
                      className={styles.headerText}
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'inline',
                          color: 'yellow',
                        },
                      }}
                    >
                      ADMIN
                    </Typography>
                  </Box>
                ) : null}
                {/* .......................................................................................... */}
                {User_Dev ? (
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography
                      className={styles.headerText}
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'inline',
                          color: 'yellow',
                        },
                      }}
                    >
                      DEV
                    </Typography>
                  </Box>
                ) : null}
                {/* .......................................................................................... */}
                {User_UserSwitch ? (
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography
                      className={styles.headerText}
                      sx={{
                        display: {
                          xs: 'none',
                          sm: 'inline',
                          color: 'white',
                          backgroundColor: 'purple',
                        },
                      }}
                    >
                      SWITCHED
                    </Typography>
                  </Box>
                ) : null}
                {/* .......................................................................................... */}
                {User_Dev ? (
                  <Box display='flex' alignItems='center' justifyContent='center'>
                    <Typography
                      className={styles.headerText}
                      sx={{ display: { xs: 'none', sm: 'inline', color: 'yellow' } }}
                    >{`Server(${App_Server})  Database(${App_Database})`}</Typography>
                  </Box>
                ) : null}
                {/* .......................................................................................... */}
              </div>
            </div>

            <div className={styles.right}>
              <div className={styles.rightcontainer}>
                <Box display='flex' alignItems='center' justifyContent='center'>
                  <DarkModeToggle />
                </Box>
                {/* .......................................................................................... */}

                {showButton_Library && (
                  <MyButton
                    className={styles.links}
                    onClick={() => router.push('/Library')}
                    text='Library'
                  ></MyButton>
                )}
                {/* .......................................................................................... */}

                {showButton_QuizHistory && (
                  <MyButton
                    className={styles.links}
                    onClick={() => router.push('/QuizHistory')}
                    text='History'
                  ></MyButton>
                )}
                {/* .......................................................................................... */}
                {showButton_UsersSettings && (
                  <MyButton
                    className={styles.links}
                    onClick={() => router.push('/UsersSettings')}
                    text='Settings'
                  ></MyButton>
                )}

                {/* .......................................................................................... */}
                {showButton_SwitchUser && (
                  <MyButton
                    className={styles.links}
                    onClick={() => router.push('/SwitchUser')}
                    text='Switch User'
                  ></MyButton>
                )}
                {/* .......................................................................................... */}
                {User_SignedIn && (
                  <MyButton
                    className={styles.links}
                    onClick={() => {
                      handleLogout()
                    }}
                    text='Logout'
                  ></MyButton>
                )}
                {/* .......................................................................................... */}
                {session.status === 'authenticated' && (
                  <MyButton className={styles.logout} onClick={signOut} text='Logout'></MyButton>
                )}
              </div>
            </div>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  )
}
