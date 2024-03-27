import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog = false
const debugModule = 'Appwrite_App_Env'
//
//  Constant Values
//
import {
  CONST_DEFAULT,
  SERVER_DATABASE,
  NODE_ENV,
  TIMEOUT,
  TIMEOUT_EXTRA,
  TIMEOUT_RETRY,
  SERVER01,
  DATABASE01,
  SERVERURL01,
  SERVER02,
  DATABASE02,
  SERVERURL02,
  SERVER03,
  DATABASE03,
  SERVERURL03,
  SERVER04,
  DATABASE04,
  SERVERURL04,
  SERVER11,
  SERVERURL11,
  SERVER12,
  SERVERURL12,
  SERVER13,
  SERVERURL13,
  SERVER14,
  SERVERURL14,
  SERVER16,
  DATABASE6,
  SERVERURL16,
  SERVER17,
  DATABASE7,
  SERVERURL17,
  DFT_USER_MAXQUESTIONS,
  DFT_USER_OWNER,
  DFT_USER_SHOWPROGRESS,
  DFT_USER_SHOWSCORE,
  DFT_USER_SORTQUESTIONS,
  DFT_USER_SKIPCORRECT,
  URL_HELLO,
  URL_REGISTER,
  URL_REGISTERPWD,
  URL_SIGNIN,
  URL_TABLES,
  BACKGROUNDCOLOR_TABLEPAPER,
  BACKGROUNDCOLOR_MYINPUT,
  BACKGROUNDCOLOR_MYINPUTDISABLED,
  BACKGROUNDCOLOR_TABLEHEAD,
  BACKGROUNDCOLOR_TABLEBODY,
  BACKGROUNDCOLOR_PAGEHEAD,
  BACKGROUNDCOLOR_FORMPAPER,
  BACKGROUNDCOLOR_NAVBAR,
} from './AppConstants'
//...........................................................................
export default function Appwrite_App_Env() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //...........................................................................
  //  Defaults
  //...........................................................................
  const App_Env = {
    SERVER_DATABASE: SERVER_DATABASE,
    NODE_ENV: NODE_ENV,
    TIMEOUT: TIMEOUT,
    TIMEOUT_EXTRA: TIMEOUT_EXTRA,
    TIMEOUT_RETRY: TIMEOUT_RETRY,
    SERVER01: SERVER01,
    DATABASE01: DATABASE01,
    SERVERURL01: SERVERURL01,
    SERVER02: SERVER02,
    DATABASE02: DATABASE02,
    SERVERURL02: SERVERURL02,
    SERVER03: SERVER03,
    DATABASE03: DATABASE03,
    SERVERURL03: SERVERURL03,
    SERVER04: SERVER04,
    DATABASE04: DATABASE04,
    SERVERURL04: SERVERURL04,
    SERVER11: SERVER11,
    SERVERURL11: SERVERURL11,
    SERVER12: SERVER12,
    SERVERURL12: SERVERURL12,
    SERVER13: SERVER13,
    SERVERURL13: SERVERURL13,
    SERVER14: SERVER14,
    SERVERURL14: SERVERURL14,
    SERVER16: SERVER16,
    DATABASE6: DATABASE6,
    SERVERURL16: SERVERURL16,
    SERVER17: SERVER17,
    DATABASE7: DATABASE7,
    SERVERURL17: SERVERURL17,
    DFT_USER_MAXQUESTIONS: DFT_USER_MAXQUESTIONS,
    DFT_USER_OWNER: DFT_USER_OWNER,
    DFT_USER_SHOWPROGRESS: DFT_USER_SHOWPROGRESS,
    DFT_USER_SHOWSCORE: DFT_USER_SHOWSCORE,
    DFT_USER_SORTQUESTIONS: DFT_USER_SORTQUESTIONS,
    DFT_USER_SKIPCORRECT: DFT_USER_SKIPCORRECT,
    URL_HELLO: URL_HELLO,
    URL_REGISTER: URL_REGISTER,
    URL_REGISTERPWD: URL_REGISTERPWD,
    URL_SIGNIN: URL_SIGNIN,
    URL_TABLES: URL_TABLES,
    BACKGROUNDCOLOR_TABLEPAPER,
    BACKGROUNDCOLOR_MYINPUT,
    BACKGROUNDCOLOR_MYINPUTDISABLED,
    BACKGROUNDCOLOR_TABLEHEAD,
    BACKGROUNDCOLOR_TABLEBODY,
    BACKGROUNDCOLOR_PAGEHEAD,
    BACKGROUNDCOLOR_FORMPAPER,
    BACKGROUNDCOLOR_NAVBAR,
  }
  //
  //  Save
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), App_Env)
  sessionStorageSet({ caller: debugModule, itemName: 'App_Env', itemValue: App_Env })
  //...........................................................................
  //  Override Process.env variables
  //...........................................................................
  //
  //  Environment (Development/Production)
  //
  if (process.env.NEXT_PUBLIC_NODE_ENV && process.env.NEXT_PUBLIC_NODE_ENV !== CONST_DEFAULT)
    App_Env.NODE_ENV = process.env.NEXT_PUBLIC_NODE_ENV
  //
  //  Database Production (Env Variable)
  //
  if (App_Env.NODE_ENV !== 'development') {
    if (
      process.env.NEXT_PUBLIC_SERVER_DATABASE &&
      process.env.NEXT_PUBLIC_SERVER_DATABASE !== CONST_DEFAULT
    )
      App_Env.SERVER_DATABASE = process.env.NEXT_PUBLIC_SERVER_DATABASE.trim()
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
  if (process.env.NEXT_PUBLIC_TIMEOUT && process.env.NEXT_PUBLIC_TIMEOUT !== CONST_DEFAULT)
    App_Env.TIMEOUT = parseInt(process.env.NEXT_PUBLIC_TIMEOUT)
  if (
    process.env.NEXT_PUBLIC_TIMEOUT_EXTRA &&
    process.env.NEXT_PUBLIC_TIMEOUT_EXTRA !== CONST_DEFAULT
  )
    App_Env.TIMEOUT_EXTRA = parseInt(process.env.NEXT_PUBLIC_TIMEOUT_EXTRA)
  if (
    process.env.NEXT_PUBLIC_TIMEOUT_RETRY &&
    process.env.NEXT_PUBLIC_TIMEOUT_RETRY !== CONST_DEFAULT
  )
    App_Env.TIMEOUT_RETRY = parseInt(process.env.NEXT_PUBLIC_TIMEOUT_RETRY)
  //
  // Remote - Servers
  //
  if (process.env.NEXT_PUBLIC_SERVER01 && process.env.NEXT_PUBLIC_SERVER01 !== CONST_DEFAULT)
    App_Env.SERVER01 = process.env.NEXT_PUBLIC_SERVER01
  if (process.env.NEXT_PUBLIC_DATABASE01 && process.env.NEXT_PUBLIC_DATABASE01 !== CONST_DEFAULT)
    App_Env.DATABASE01 = process.env.NEXT_PUBLIC_DATABASE01
  if (process.env.NEXT_PUBLIC_SERVERURL01 && process.env.NEXT_PUBLIC_SERVERURL01 !== CONST_DEFAULT)
    App_Env.SERVERURL01 = process.env.NEXT_PUBLIC_SERVERURL01

  if (process.env.NEXT_PUBLIC_SERVER02 && process.env.NEXT_PUBLIC_SERVER02 !== CONST_DEFAULT)
    App_Env.SERVER02 = process.env.NEXT_PUBLIC_SERVER02
  if (process.env.NEXT_PUBLIC_DATABASE02 && process.env.NEXT_PUBLIC_DATABASE02 !== CONST_DEFAULT)
    App_Env.DATABASE02 = process.env.NEXT_PUBLIC_DATABASE02
  if (process.env.NEXT_PUBLIC_SERVERURL02 && process.env.NEXT_PUBLIC_SERVERURL02 !== CONST_DEFAULT)
    App_Env.SERVERURL02 = process.env.NEXT_PUBLIC_SERVERURL02

  if (process.env.NEXT_PUBLIC_SERVER03 && process.env.NEXT_PUBLIC_SERVER03 !== CONST_DEFAULT)
    App_Env.SERVER03 = process.env.NEXT_PUBLIC_SERVER03
  if (process.env.NEXT_PUBLIC_DATABASE03 && process.env.NEXT_PUBLIC_DATABASE03 !== CONST_DEFAULT)
    App_Env.DATABASE03 = process.env.NEXT_PUBLIC_DATABASE03
  if (process.env.NEXT_PUBLIC_SERVERURL03 && process.env.NEXT_PUBLIC_SERVERURL03 !== CONST_DEFAULT)
    App_Env.SERVERURL03 = process.env.NEXT_PUBLIC_SERVERURL03

  if (process.env.NEXT_PUBLIC_SERVER04 && process.env.NEXT_PUBLIC_SERVER04 !== CONST_DEFAULT)
    App_Env.SERVER04 = process.env.NEXT_PUBLIC_SERVER04
  if (process.env.NEXT_PUBLIC_DATABASE04 && process.env.NEXT_PUBLIC_DATABASE04 !== CONST_DEFAULT)
    App_Env.DATABASE04 = process.env.NEXT_PUBLIC_DATABASE04
  if (process.env.NEXT_PUBLIC_SERVERURL04 && process.env.NEXT_PUBLIC_SERVERURL04 !== CONST_DEFAULT)
    App_Env.SERVERURL04 = process.env.NEXT_PUBLIC_SERVERURL04
  //
  // Local Servers
  //
  if (process.env.NEXT_PUBLIC_SERVER11 && process.env.NEXT_PUBLIC_SERVER11 !== CONST_DEFAULT)
    App_Env.SERVER11 = process.env.NEXT_PUBLIC_SERVER11
  if (process.env.NEXT_PUBLIC_SERVERURL11 && process.env.NEXT_PUBLIC_SERVERURL11 !== CONST_DEFAULT)
    App_Env.SERVERURL11 = process.env.NEXT_PUBLIC_SERVERURL11

  if (process.env.NEXT_PUBLIC_SERVER12 && process.env.NEXT_PUBLIC_SERVER12 !== CONST_DEFAULT)
    App_Env.SERVER12 = process.env.NEXT_PUBLIC_SERVER12
  if (process.env.NEXT_PUBLIC_SERVERURL12 && process.env.NEXT_PUBLIC_SERVERURL12 !== CONST_DEFAULT)
    App_Env.SERVERURL12 = process.env.NEXT_PUBLIC_SERVERURL12

  if (process.env.NEXT_PUBLIC_SERVER13 && process.env.NEXT_PUBLIC_SERVER13 !== CONST_DEFAULT)
    App_Env.SERVER13 = process.env.NEXT_PUBLIC_SERVER13
  if (process.env.NEXT_PUBLIC_SERVERURL13 && process.env.NEXT_PUBLIC_SERVERURL13 !== CONST_DEFAULT)
    App_Env.SERVERURL13 = process.env.NEXT_PUBLIC_SERVERURL13

  if (process.env.NEXT_PUBLIC_SERVER14 && process.env.NEXT_PUBLIC_SERVER14 !== CONST_DEFAULT)
    App_Env.SERVER14 = process.env.NEXT_PUBLIC_SERVER14
  if (process.env.NEXT_PUBLIC_SERVERURL14 && process.env.NEXT_PUBLIC_SERVERURL14 !== CONST_DEFAULT)
    App_Env.SERVERURL14 = process.env.NEXT_PUBLIC_SERVERURL14

  if (process.env.NEXT_PUBLIC_SERVER16 && process.env.NEXT_PUBLIC_SERVER16 !== CONST_DEFAULT)
    App_Env.SERVER16 = process.env.NEXT_PUBLIC_SERVER16
  if (process.env.NEXT_PUBLIC_DATABASE6 && process.env.NEXT_PUBLIC_DATABASE6 !== CONST_DEFAULT)
    App_Env.DATABASE6 = process.env.NEXT_PUBLIC_DATABASE6
  if (process.env.NEXT_PUBLIC_SERVERURL16 && process.env.NEXT_PUBLIC_SERVERURL16 !== CONST_DEFAULT)
    App_Env.SERVERURL16 = process.env.NEXT_PUBLIC_SERVERURL16

  if (process.env.NEXT_PUBLIC_SERVER17 && process.env.NEXT_PUBLIC_SERVER17 !== CONST_DEFAULT)
    App_Env.SERVER17 = process.env.NEXT_PUBLIC_SERVER17
  if (process.env.NEXT_PUBLIC_DATABASE7 && process.env.NEXT_PUBLIC_DATABASE7 !== CONST_DEFAULT)
    App_Env.DATABASE7 = process.env.NEXT_PUBLIC_DATABASE7
  if (process.env.NEXT_PUBLIC_SERVERURL17 && process.env.NEXT_PUBLIC_SERVERURL17 !== CONST_DEFAULT)
    App_Env.SERVERURL17 = process.env.NEXT_PUBLIC_SERVERURL17
  //
  //  User Defaults
  //
  if (
    process.env.NEXT_PUBLIC_DFT_USER_MAXQUESTIONS &&
    process.env.NEXT_PUBLIC_DFT_USER_MAXQUESTIONS !== CONST_DEFAULT
  )
    App_Env.DFT_USER_MAXQUESTIONS = parseInt(process.env.NEXT_PUBLIC_DFT_USER_MAXQUESTIONS)

  if (
    process.env.NEXT_PUBLIC_DFT_USER_OWNER &&
    process.env.NEXT_PUBLIC_DFT_USER_OWNER !== CONST_DEFAULT
  )
    App_Env.DFT_USER_OWNER = process.env.NEXT_PUBLIC_DFT_USER_OWNER

  if (
    process.env.NEXT_PUBLIC_DFT_USER_SHOWPROGRESS &&
    process.env.NEXT_PUBLIC_DFT_USER_SHOWPROGRESS !== CONST_DEFAULT
  ) {
    process.env.NEXT_PUBLIC_DFT_USER_SHOWPROGRESS === 'true'
      ? (App_Env.DFT_USER_SHOWPROGRESS = true)
      : (App_Env.DFT_USER_SHOWPROGRESS = false)
  }

  if (
    process.env.NEXT_PUBLIC_DFT_USER_SHOWSCORE &&
    process.env.NEXT_PUBLIC_DFT_USER_SHOWSCORE !== CONST_DEFAULT
  ) {
    process.env.NEXT_PUBLIC_DFT_USER_SHOWSCORE === 'true'
      ? (App_Env.DFT_USER_SHOWSCORE = true)
      : (App_Env.DFT_USER_SHOWSCORE = false)
  }

  if (
    process.env.NEXT_PUBLIC_DFT_USER_SORTQUESTIONS &&
    process.env.NEXT_PUBLIC_DFT_USER_SORTQUESTIONS !== CONST_DEFAULT
  ) {
    process.env.NEXT_PUBLIC_DFT_USER_SORTQUESTIONS === 'true'
      ? (App_Env.DFT_USER_SORTQUESTIONS = true)
      : (App_Env.DFT_USER_SORTQUESTIONS = false)
  }

  if (
    process.env.NEXT_PUBLIC_DFT_USER_SKIPCORRECT &&
    process.env.NEXT_PUBLIC_DFT_USER_SKIPCORRECT !== CONST_DEFAULT
  ) {
    process.env.NEXT_PUBLIC_DFT_USER_SKIPCORRECT === 'true'
      ? (App_Env.DFT_USER_SKIPCORRECT = true)
      : (App_Env.DFT_USER_SKIPCORRECT = false)
  }
  //
  // Server details
  //
  if (process.env.NEXT_PUBLIC_URL_HELLO && process.env.NEXT_PUBLIC_URL_HELLO !== CONST_DEFAULT)
    App_Env.URL_HELLO = process.env.NEXT_PUBLIC_URL_HELLO
  if (
    process.env.NEXT_PUBLIC_URL_REGISTER &&
    process.env.NEXT_PUBLIC_URL_REGISTER !== CONST_DEFAULT
  )
    App_Env.URL_REGISTER = process.env.NEXT_PUBLIC_URL_REGISTER
  if (process.env.NEXT_PUBLIC_URL_SIGNIN && process.env.NEXT_PUBLIC_URL_SIGNIN !== CONST_DEFAULT)
    App_Env.URL_SIGNIN = process.env.NEXT_PUBLIC_URL_SIGNIN
  if (process.env.NEXT_PUBLIC_URL_TABLES && process.env.NEXT_PUBLIC_URL_TABLES !== CONST_DEFAULT)
    App_Env.URL_TABLES = process.env.NEXT_PUBLIC_URL_TABLES
  //
  //  BackgroundColor
  //
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEPAPER &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEPAPER !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_TABLEPAPER = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEPAPER
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUT &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUT !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_MYINPUT = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUT
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUTDISABLED &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUTDISABLED !== CONST_DEFAULT
  )
    App_Env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUTDISABLED =
      process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_MYINPUTDISABLED
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEHEAD &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEHEAD !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_TABLEHEAD = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEHEAD
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEBODY &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEBODY !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_TABLEBODY = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_TABLEBODY
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_PAGEHEAD &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_PAGEHEAD !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_PAGEHEAD = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_PAGEHEAD
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_FORMPAPER = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_FORMPAPER
  if (
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_NAVBAR &&
    process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_NAVBAR !== CONST_DEFAULT
  )
    App_Env.BACKGROUNDCOLOR_NAVBAR = process.env.NEXT_PUBLIC_BACKGROUNDCOLOR_NAVBAR
  //
  //  Save
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), App_Env)
  sessionStorageSet({ caller: debugModule, itemName: 'App_Env', itemValue: App_Env })
}
