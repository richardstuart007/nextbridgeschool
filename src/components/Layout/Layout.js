//
//  Libraries
//
import { Typography, Avatar, Grid } from '@mui/material'
//
//  Components
//
import cards from '../../assets/images/cards.svg'
//
//  Debug Settings
//
import debugSettings from '../../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
//...........................................................................
// Global CONSTANTS
//...........................................................................
//
//  Debug Settings
//
let debugLog
const debugModule = 'Layout'
//============================================================================
//= Exported Module
//============================================================================
export default function Layout() {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //...........................................................................
  // Module STATE
  //...........................................................................

  //...........................................................................
  // Module Main Line
  //...........................................................................
  //
  //  Add clientserver
  //
  const App_Server = JSON.parse(sessionStorage.getItem('App_Server'))
  const App_Database = JSON.parse(sessionStorage.getItem('App_Database'))
  const clientserver = ` Server(${App_Server}) Database(${App_Database})`
  //
  //  Default if not signed in
  //
  let User_Name = ''
  let User_Admin = false
  let User_Dev = false
  let User_Switched = false
  //
  //  Signed in User
  //
  let ShowClientServer = true
  const User_SignedIn = JSON.parse(sessionStorage.getItem('User_SignedIn'))
  if (User_SignedIn) {
    const User_User = JSON.parse(sessionStorage.getItem('User_User'))
    const User_UserSwitch = JSON.parse(sessionStorage.getItem('User_UserSwitch'))
    User_Name = User_User.u_name
    User_Admin = User_User.u_admin
    User_Dev = User_User.u_dev
    User_Switched = User_UserSwitch
    //
    //  Do not show clientserver if not dev
    //
    ShowClientServer = User_Dev
  }
  //...................................................................................
  //.  Render the component
  //...................................................................................
  return (
    <div>
      <Grid container alignItems='center'>
        {/* .......................................................................................... */}
        <Grid item>
          <Avatar src={cards} />
        </Grid>
        {/* .......................................................................................... */}
        {User_SignedIn ? (
          <Grid item>
            <Typography
              sx={{
                display: { xs: 'none', sm: 'inline' },
                color: 'red'
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
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' }
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
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'red' }
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
                display: { xs: 'none', sm: 'inline', color: 'white', backgroundColor: 'purple' }
              }}
            >
              SWITCHED
            </Typography>
          </Grid>
        ) : null}
        {/* .......................................................................................... */}
        {ShowClientServer ? (
          <Grid item>
            <Typography sx={{ display: { xs: 'none', sm: 'inline' } }}>{clientserver}</Typography>
          </Grid>
        ) : null}

        {/* .......................................................................................... */}
        <Grid item xs></Grid>
      </Grid>
    </div>
  )
}
