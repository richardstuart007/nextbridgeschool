//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
//
//  Debug Settings
//
let debugLog
const debugModule = 'writeApp_Env'
export default function writeApp_Env() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //...........................................................................
  //  Defaults
  //...........................................................................
  const App_Env = {
    DEBUG_LOG_OVERRIDE: false,
    DEBUG_LOG: false,
    PAGESTART: 'Library',
    PAGESTARTAPP: 'Splash',
    SERVER_DATABASE: '04',
    NODE_ENV: 'production',
    TIMEOUT: 1000,
    TIMEOUT_EXTRA: 1500,
    TIMEOUT_RETRY: 2,
    SERVER01: 'REMOTE:Render/3901',
    DATABASE01: 'REMOTE-1:Elephant',
    SERVERURL01: 'https://bridgeserver01.onrender.com',
    SERVER02: 'REMOTE:Render/3902',
    DATABASE02: 'REMOTE-2:Railway',
    SERVERURL02: 'https://bridgeserver02.onrender.com',
    SERVER03: 'REMOTE:Cyclic/3903',
    DATABASE03: 'REMOTE-3:Elephant',
    SERVERURL03: 'https://bridgeserver03.cyclic.app',
    SERVER04: 'REMOTE:Cyclic/3904',
    DATABASE04: 'REMOTE-4:Railway04',
    SERVERURL04: 'https://bridgeserver04.cyclic.app',
    SERVER11: 'LOCAL:3911',
    SERVERURL11: 'http://localhost:3911',
    SERVER12: 'LOCAL:3912',
    SERVERURL12: 'http://localhost:3912',
    SERVER13: 'LOCAL:3913',
    SERVERURL13: 'http://localhost:3913',
    SERVER14: 'LOCAL:3914',
    SERVERURL14: 'http://localhost:3914',
    SERVER16: 'LOCAL:3916',
    DATABASE6: 'http://localhost:3916',
    SERVERURL16: 'LOCAL:bridge6',
    SERVER17: 'LOCAL:3917',
    DATABASE7: 'http://localhost:3917',
    SERVERURL17: 'LOCAL:bridge7',
    DFT_USER_MAXQUESTIONS: 20,
    DFT_USER_OWNER: 'Richard',
    DFT_USER_SHOWPROGRESS: true,
    DFT_USER_SHOWSCORE: true,
    DFT_USER_SORTQUESTIONS: true,
    DFT_USER_SKIPCORRECT: true,
    URL_HELLO: '/QuizHello',
    URL_REGISTER: '/QuizRegister',
    URL_SIGNIN: '/QuizSignin',
    URL_TABLES: '/QuizTables'
  }
  //
  //  Save
  //
  const JSON1 = JSON.stringify(App_Env)
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_EnvJSON defaults'), JSON1)
  sessionStorage.setItem('App_Env', JSON1)
  //...........................................................................
  //  Override Process.env variables
  //...........................................................................
  //
  //  Debug Settings
  //
  if (process.env.REACT_APP_DEBUG_LOG_OVERRIDE) {
    process.env.REACT_APP_DEBUG_LOG_OVERRIDE === 'true'
      ? (App_Env.DEBUG_LOG_OVERRIDE = true)
      : (App_Env.DEBUG_LOG_OVERRIDE = false)
  }

  if (process.env.REACT_APP_DEBUG_LOG) {
    process.env.REACT_APP_DEBUG_LOG === 'true'
      ? (App_Env.DEBUG_LOG = true)
      : (App_Env.DEBUG_LOG = false)
  }
  //
  //  Page Start
  //
  if (process.env.REACT_APP_PAGESTART) App_Env.PAGESTART = process.env.REACT_APP_PAGESTART
  if (process.env.REACT_APP_PAGESTARTAPP) App_Env.PAGESTARTAPP = process.env.REACT_APP_PAGESTARTAPP
  //
  //  Environment
  //
  if (process.env.NODE_ENV) App_Env.NODE_ENV = process.env.NODE_ENV
  //
  //  Database Production (Env Variable)
  //
  if (App_Env.NODE_ENV !== 'development') {
    if (process.env.REACT_APP_SERVER_DATABASE)
      App_Env.SERVER_DATABASE = process.env.REACT_APP_SERVER_DATABASE.trim()
  }
  //
  //  Database Development (from Port)
  //
  else {
    const port = window.location.port
    if (debugLog) console.log(consoleLogTime(debugModule, 'port '), port)
    const database = String(port).slice(-2)
    if (debugLog) console.log(consoleLogTime(debugModule, 'database '), database)
    App_Env.SERVER_DATABASE = database
  }
  //
  //  Fetch timeouts
  //
  if (process.env.REACT_APP_TIMEOUT) App_Env.TIMEOUT = parseInt(process.env.REACT_APP_TIMEOUT)
  if (process.env.REACT_APP_TIMEOUT_EXTRA)
    App_Env.TIMEOUT_EXTRA = parseInt(process.env.REACT_APP_TIMEOUT_EXTRA)
  if (process.env.REACT_APP_TIMEOUT_RETRY)
    App_Env.TIMEOUT_RETRY = parseInt(process.env.REACT_APP_TIMEOUT_RETRY)
  //
  // Remote - Servers
  //
  if (process.env.REACT_APP_SERVER01) App_Env.SERVER01 = process.env.REACT_APP_SERVER01
  if (process.env.REACT_APP_DATABASE01) App_Env.DATABASE01 = process.env.REACT_APP_DATABASE01
  if (process.env.REACT_APP_SERVERURL01) App_Env.SERVERURL01 = process.env.REACT_APP_SERVERURL01

  if (process.env.REACT_APP_SERVER02) App_Env.SERVER02 = process.env.REACT_APP_SERVER02
  if (process.env.REACT_APP_DATABASE02) App_Env.DATABASE02 = process.env.REACT_APP_DATABASE02
  if (process.env.REACT_APP_SERVERURL02) App_Env.SERVERURL02 = process.env.REACT_APP_SERVERURL02

  if (process.env.REACT_APP_SERVER03) App_Env.SERVER03 = process.env.REACT_APP_SERVER03
  if (process.env.REACT_APP_DATABASE03) App_Env.DATABASE03 = process.env.REACT_APP_DATABASE03
  if (process.env.REACT_APP_SERVERURL03) App_Env.SERVERURL03 = process.env.REACT_APP_SERVERURL03

  if (process.env.REACT_APP_SERVER04) App_Env.SERVER04 = process.env.REACT_APP_SERVER04
  if (process.env.REACT_APP_DATABASE04) App_Env.DATABASE04 = process.env.REACT_APP_DATABASE04
  if (process.env.REACT_APP_SERVERURL04) App_Env.SERVERURL04 = process.env.REACT_APP_SERVERURL04
  //
  // Local Servers
  //
  if (process.env.REACT_APP_SERVER11) App_Env.SERVER11 = process.env.REACT_APP_SERVER11
  if (process.env.REACT_APP_SERVERURL11) App_Env.SERVERURL11 = process.env.REACT_APP_SERVERURL11

  if (process.env.REACT_APP_SERVER12) App_Env.SERVER12 = process.env.REACT_APP_SERVER12
  if (process.env.REACT_APP_SERVERURL12) App_Env.SERVERURL12 = process.env.REACT_APP_SERVERURL12

  if (process.env.REACT_APP_SERVER13) App_Env.SERVER13 = process.env.REACT_APP_SERVER13
  if (process.env.REACT_APP_SERVERURL13) App_Env.SERVERURL13 = process.env.REACT_APP_SERVERURL13

  if (process.env.REACT_APP_SERVER14) App_Env.SERVER14 = process.env.REACT_APP_SERVER14
  if (process.env.REACT_APP_SERVERURL14) App_Env.SERVERURL14 = process.env.REACT_APP_SERVERURL14

  if (process.env.REACT_APP_SERVER16) App_Env.SERVER16 = process.env.REACT_APP_SERVER16
  if (process.env.REACT_APP_DATABASE6) App_Env.DATABASE6 = process.env.REACT_APP_DATABASE6
  if (process.env.REACT_APP_SERVERURL16) App_Env.SERVERURL16 = process.env.REACT_APP_SERVERURL16

  if (process.env.REACT_APP_SERVER17) App_Env.SERVER17 = process.env.REACT_APP_SERVER17
  if (process.env.REACT_APP_DATABASE7) App_Env.DATABASE7 = process.env.REACT_APP_DATABASE7
  if (process.env.REACT_APP_SERVERURL17) App_Env.SERVERURL17 = process.env.REACT_APP_SERVERURL17
  //
  //  User Defaults
  //
  if (process.env.REACT_APP_DFT_USER_MAXQUESTIONS)
    App_Env.DFT_USER_MAXQUESTIONS = parseInt(process.env.REACT_APP_DFT_USER_MAXQUESTIONS)

  if (process.env.REACT_APP_DFT_USER_OWNER)
    App_Env.DFT_USER_OWNER = process.env.REACT_APP_DFT_USER_OWNER

  if (process.env.REACT_APP_DFT_USER_SHOWPROGRESS) {
    process.env.REACT_APP_DFT_USER_SHOWPROGRESS === 'true'
      ? (App_Env.DFT_USER_SHOWPROGRESS = true)
      : (App_Env.DFT_USER_SHOWPROGRESS = false)
  }

  if (process.env.REACT_APP_DFT_USER_SHOWSCORE) {
    process.env.REACT_APP_DFT_USER_SHOWSCORE === 'true'
      ? (App_Env.DFT_USER_SHOWSCORE = true)
      : (App_Env.DFT_USER_SHOWSCORE = false)
  }

  if (process.env.REACT_APP_DFT_USER_SORTQUESTIONS) {
    process.env.REACT_APP_DFT_USER_SORTQUESTIONS === 'true'
      ? (App_Env.DFT_USER_SORTQUESTIONS = true)
      : (App_Env.DFT_USER_SORTQUESTIONS = false)
  }

  if (process.env.REACT_APP_DFT_USER_SKIPCORRECT) {
    process.env.REACT_APP_DFT_USER_SKIPCORRECT === 'true'
      ? (App_Env.DFT_USER_SKIPCORRECT = true)
      : (App_Env.DFT_USER_SKIPCORRECT = false)
  }
  //
  // Server details
  //
  if (process.env.REACT_APP_URL_HELLO) App_Env.URL_HELLO = process.env.REACT_APP_URL_HELLO
  if (process.env.REACT_APP_URL_REGISTER) App_Env.URL_REGISTER = process.env.REACT_APP_URL_REGISTER
  if (process.env.REACT_APP_URL_SIGNIN) App_Env.URL_SIGNIN = process.env.REACT_APP_URL_SIGNIN
  if (process.env.REACT_APP_URL_TABLES) App_Env.URL_TABLES = process.env.REACT_APP_URL_TABLES
  //
  //  Save
  //
  const JSON2 = JSON.stringify(App_Env)
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_EnvJSON Env Variables '), JSON2)
  sessionStorage.setItem('App_Env', JSON2)
}
