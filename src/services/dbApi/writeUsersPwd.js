//
//  services
//
import apiAxios from '/src/services/dbApi/apiAxios'
import sessionStorageGet from '/src/services/sessionStorage/sessionStorageGet'
//
//  Debug Settings
//
import debugSettings from '/src/services/debug/debugSettings'
import consoleLogTime from '/src/services/debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsersPwd'
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function writeUsersPwd(props) {
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Application Environment Variables
  //
  const App_Env = sessionStorageGet({
    caller: debugModule,
    itemName: 'App_Env',
  })
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env'), { ...App_Env })
  //
  //  Deconstruct props
  //
  const { AxCaller, user, password } = props
  let AxClient = `${debugModule}/${AxCaller}`
  //
  //  Get the URL
  //
  const App_URL = sessionStorageGet({
    caller: debugModule,
    itemName: 'App_URL',
  })
  //
  // Fetch the data
  //
  let rtnObj = fetchItems()
  return rtnObj
  //--------------------------------------------------------------------
  //.  fetch data
  //--------------------------------------------------------------------
  async function fetchItems() {
    let body
    try {
      //
      //  Setup actions
      //
      body = {
        AxClient: AxClient,
        AxTable: 'userspwd',
        user: user,
        password: password,
      }
      const URL = App_URL + App_Env.URL_REGISTERPWD
      //
      //  Info
      //
      const info = `Client(${AxClient}) Action(RegisterPwd)`
      //
      //  SQL database
      //
      const apiAxiosProps = {
        AxUrl: URL,
        AxData: body,
        AxTimeout: 2500,
        AxInfo: info,
      }
      rtnObj = await apiAxios(apiAxiosProps)
      return rtnObj
      //
      // Errors
      //
    } catch (err) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch err'), { ...err })
      const rtnObj = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: [],
      }
      return rtnObj
    }
  }
  //--------------------------------------------------------------------
}
