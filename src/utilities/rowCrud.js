//
//  Utilities
//
import apiAxios from './apiAxios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
let debugLog
const debugModule = 'rowCrud'
//--------------------------------------------------------------------
//-  Main Line
//--------------------------------------------------------------------
export default async function rowCrud(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  //
  //  Define returned object (for errors)
  //
  const rtnErr = {
    rtnBodyParms: '',
    rtnValue: false,
    rtnMessage: '',
    rtnSqlFunction: debugModule,
    rtnCatchFunction: '',
    rtnCatch: false,
    rtnCatchMsg: '',
    rtnRows: []
  }
  //
  //  Deconstruct
  //
  const {
    AxCaller,
    AxMethod = 'post',
    AxAction = 'SELECT',
    AxTable,
    AxString,
    AxWhere,
    AxRow,
    AxKeyName,
    AxOrderBy,
    AxOrderByRaw,
    AxTimeout
  } = props
  if (debugLog) console.log(consoleLogTime(debugModule, 'Props'), { ...props })
  const AxClient = `${debugModule}/${AxCaller}`
  //
  //  Try
  //
  try {
    //
    //  Validate the parameters
    //
    const valid = validateProps()
    //
    //  Invalid return message
    //
    if (!valid) {
      console.log(
        consoleLogTime(
          `AxClient(${AxClient}) Action(${AxAction}) Table(${AxTable}) Error(${rtnErr.rtnMessage})`
        )
      )
      return rtnErr
    }
    //
    // Fetch the data
    //
    const rtnObjServer = sqlDatabase()
    //
    //  Return value from Server
    //
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjServer'), { ...rtnObjServer })
    return rtnObjServer
    //
    //  Catch Errors
    //
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
    rtnErr.rtnCatch = true
    rtnErr.rtnCatchMsg = 'rowCrud catch error'
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnErr'), { ...rtnErr })
    return rtnErr
  }
  //--------------------------------------------------------------------
  //  Validate the parameters
  //--------------------------------------------------------------------
  function validateProps() {
    //
    // Check values sent
    //
    if (!AxAction) {
      rtnErr.rtnMessage = `SqlAction parameter not passed`
      return false
    }
    //
    //  Validate Action
    //
    if (
      AxAction !== 'DELETE' &&
      AxAction !== 'EXIST' &&
      AxAction !== 'SELECTSQL' &&
      AxAction !== 'SELECT' &&
      AxAction !== 'INSERT' &&
      AxAction !== 'UPDATE' &&
      AxAction !== 'UPDATERAW' &&
      AxAction !== 'UPSERT'
    ) {
      rtnErr.rtnMessage = `SqlAction ${AxAction}: SqlAction not valid`
      return false
    }
    //
    //  SELECTSQL needs String
    //
    if ((AxAction === 'SELECTSQL' || AxAction === 'UPDATERAW') && !AxString) {
      rtnErr.rtnMessage = `SqlAction ${AxAction}: String not passed`
      return false
    }
    //
    //  not SELECTSQL needs table
    //
    if (AxAction !== 'SELECTSQL' && !AxTable) {
      rtnErr.rtnMessage = `SqlAction ${AxAction}: Table not passed`
      return false
    }
    //
    //  Valid
    //
    return true
  }
  //--------------------------------------------------------------------
  //  Database SQL
  //--------------------------------------------------------------------
  async function sqlDatabase() {
    let body
    try {
      //
      //  Body
      //
      body = {
        AxClient: AxClient,
        AxTable: AxTable,
        AxAction: AxAction,
        AxString: AxString,
        AxWhere: AxWhere,
        AxRow: AxRow,
        AxKeyName: AxKeyName,
        AxOrderBy: AxOrderBy,
        AxOrderByRaw: AxOrderByRaw
      }
      //
      //  Base URL
      //
      const App_URL = JSON.parse(sessionStorage.getItem('App_URL'))
      //
      //  Full URL
      //
      const URL = App_URL + App_Env.URL_TABLES
      if (debugLog) console.log(consoleLogTime(debugModule, 'URL'), URL)
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, `Client(${AxClient}) Action(${AxAction}) Table(${AxTable})`)
        )
      //
      //  Info
      //
      const info = `Client(${AxClient}) Action(${AxAction}) Table(${AxTable})`
      //
      //  SQL database
      //
      const apiAxiosProps = {
        AxMethod: AxMethod,
        AxUrl: URL,
        AxData: body,
        AxTimeout: AxTimeout,
        AxInfo: info
      }
      const rtnObjServer = await apiAxios(apiAxiosProps)
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjServer'), { ...rtnObjServer })
      return rtnObjServer
      //
      // Errors
      //
    } catch (e) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
      console.log(e)
      const rtnErr = {
        rtnBodyParms: body,
        rtnValue: false,
        rtnMessage: '',
        rtnSqlFunction: debugModule,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: 'Catch calling apiAxios',
        rtnRows: []
      }
      return rtnErr
    }
  }
}
