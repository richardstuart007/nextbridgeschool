//
//  Libraries
//
import axios from 'axios'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../debug/consoleLogTime'
let debugLog
const debugModule = 'apiAxios'
//
//  Global
//
let g_AxId = 0
let g_AxSess = 0
//===================================================================================
//
// methods - post(get), post(update), delete(delete), post(upsert)
//
export default async function apiAxios(props) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  //
  //  Application Environment Variables
  //
  const App_Env = JSON.parse(sessionStorage.getItem('App_Env'))
  if (debugLog) console.log(consoleLogTime(debugModule, 'App_Env '), App_Env)

  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))

  //
  //  Constants
  //
  const { AxMethod = 'post', AxUrl, AxData, AxInfo = 'SqlDatabase' } = props
  if (debugLog) console.log(consoleLogTime(debugModule, 'props'), { ...props })
  const AxTimeout = App_Env.TIMEOUT
  const AxRetry = App_Env.TIMEOUT_RETRY
  const AxExtra = App_Env.TIMEOUT_EXTRA
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxTimeout'), AxTimeout)
  //
  //  retry on Fail
  //
  let rtnObjtry
  rtnObjtry = await apiRetry(TryReq, AxRetry)
  //
  //  Return values to caller
  //
  if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObjtry'), { ...rtnObjtry })
  return rtnObjtry
  //--------------------------------------------------------------------------------------------
  // apiRetry
  //--------------------------------------------------------------------------------------------
  async function apiRetry(fpAsyncFunction, fpRetry) {
    let w_Last_apiRetryRtn
    for (let w_AxTry = 1; w_AxTry < fpRetry + 1; w_AxTry++) {
      try {
        const w_AxTimeoutAlt = AxTimeout + (w_AxTry - 1) * AxExtra
        const apiRetryRtn = await fpAsyncFunction(w_AxTry, w_AxTimeoutAlt, fpRetry)
        if (debugLog) console.log(consoleLogTime(debugModule, 'apiRetryRtn'), { ...apiRetryRtn })
        //
        //  No Catch (not a server error)
        //
        if (!apiRetryRtn.rtnCatch) return apiRetryRtn
        //
        //  Update last return value
        //
        w_Last_apiRetryRtn = apiRetryRtn
      } catch (error) {
        console.log(consoleLogTime(debugModule, 'CATCH Error'), error)
      }
    }
    //
    //  Return last error
    //
    return w_Last_apiRetryRtn
  }
  //--------------------------------------------------------------------------------------------
  // Try request
  //--------------------------------------------------------------------------------------------
  async function TryReq(fpAxTry, fpAxTimeoutAlt, fpRetry) {
    //
    //  Try
    //
    try {
      //
      //  Sess
      //
      const AppSessionJSON = sessionStorage.getItem('App_Session')
      if (AppSessionJSON) {
        const AppSession = JSON.parse(AppSessionJSON)
        g_AxSess = AppSession.v_vid
      }
      //
      //  Inceptor - req start time
      //
      axios.interceptors.request.use(req => {
        req.meta = req.meta || {}
        req.meta.AxrequestStartedAt = new Date().getTime()
        return req
      })
      //
      //  Inceptor - res duration (response - start time)
      //
      axios.interceptors.response.use(
        res => {
          res.AxdurationInMs = new Date().getTime() - res.config.meta.AxrequestStartedAt
          return res
        },
        res => {
          res.AxdurationInMs = new Date().getTime() - res.config.meta.AxrequestStartedAt
          throw res
        }
      )
      //
      //  Store axios values - Request
      //
      StoreReq(fpAxTry, fpAxTimeoutAlt)
      //
      //  Add information to body parms
      //
      const AxDataAlt = AxData
      AxDataAlt.AxSess = g_AxSess
      AxDataAlt.AxId = g_AxId
      AxDataAlt.AxTry = fpAxTry
      AxDataAlt.AxTimeout = fpAxTimeoutAlt
      //
      //  Invoke Axios fetch
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Request--->'), { ...AxDataAlt })
      const response = await axios({
        method: AxMethod,
        url: AxUrl,
        data: AxDataAlt,
        timeout: fpAxTimeoutAlt
      })
      //
      //  Sucessful response
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'Response-->'), { ...response })
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, `<--Timing-> ${response.AxdurationInMs} ${AxInfo} SUCCESS`)
        )
      //
      //  Errors
      //
      if (response.status < 200 || response.status >= 300)
        throw Error('Did not receive expected data')
      //
      //  Update store - Return
      //
      const apiAxiosObj = Object.assign(response.data)
      apiAxiosObj.AxdurationInMs = response.AxdurationInMs
      StoreRes(apiAxiosObj)
      //
      //  Return Object
      //
      return apiAxiosObj
      //
      //  Catch Error
      //
    } catch (error) {
      //
      //  Returned values
      //
      const apiAxiosErr = {
        rtnBodyParms: '',
        rtnValue: false,
        rtnMessage: error.message,
        rtnCatchFunction: debugModule,
        rtnCatch: true,
        rtnCatchMsg: ''
      }
      //
      //  Error logging - Error
      //
      let messageSeverity = `Warning Try ${fpAxTry}/${fpRetry}`
      if (error.message.substr(1, 7) === 'timeout')
        messageSeverity = `Warning Timeout Try ${fpAxTry}/${fpRetry}`
      if (fpAxTry === fpRetry) messageSeverity = `ERROR Final Retry ${fpAxTry} failed`
      if (debugLog) console.log(consoleLogTime(debugModule, `${messageSeverity}`), error)
      //
      //  Update body parms
      //
      apiAxiosErr.rtnBodyParms = JSON.parse(error.config.data)
      //
      //  No response
      //
      if (!error.response) {
        error.request
          ? (apiAxiosErr.rtnCatchMsg = 'No response from Server')
          : (apiAxiosErr.rtnCatchMsg = 'Request setup error')
      }
      //
      //  Error logging - Timing
      //
      if (debugLog)
        console.log(
          consoleLogTime(debugModule, `<--Timing-> ${error.AxdurationInMs} ${AxInfo} ERROR`)
        )
      //
      //  Update store
      //
      apiAxiosErr.AxdurationInMs = error.AxdurationInMs
      StoreRes(apiAxiosErr)
      return apiAxiosErr
    }
  }
  //--------------------------------------------------------------------------------------------
  // Store the request values
  //--------------------------------------------------------------------------------------------
  function StoreReq(fpAxTry, fpAxTimeoutAlt) {
    //
    //  Allocate Id
    //
    updateId()
    //
    //  Get the store
    //
    let arrReq = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Req')
    if (tempJSON) arrReq = JSON.parse(tempJSON)
    //
    //  Populate the store object
    //
    const objReq = {
      AxSess: g_AxSess,
      AxTable: AxData.AxTable,
      AxId: g_AxId,
      AxTry: fpAxTry,
      AxTimeout: fpAxTimeoutAlt,
      AxClient: AxData.AxClient,
      AxInfo: AxInfo,
      AxData: AxData,
      AxUrl: AxUrl,
      AxMethod: AxMethod
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objReq'), { ...objReq })
    //
    //  Save to array
    //
    arrReq.push(objReq)
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Req', JSON.stringify(arrReq))
  }
  //--------------------------------------------------------------------------------------------
  // Store the Return values
  //--------------------------------------------------------------------------------------------
  function StoreRes(resObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'resObj'), { ...resObj })
    //
    //  Get the store
    //
    let arrRes = []
    const tempJSON = sessionStorage.getItem('App_apiAxios_Res')
    if (tempJSON) arrRes = JSON.parse(tempJSON)
    //
    //  Count the returned rows
    //
    let rtnCount = 0
    if (resObj.rtnValue) rtnCount = resObj.rtnRows.length
    //
    //  Populate the store object
    //
    const objRes = {
      AxId: resObj.rtnBodyParms.AxId,
      AxTable: resObj.rtnBodyParms.AxTable,
      AxSts: resObj.rtnSts,
      AxCount: rtnCount,
      AxValue: resObj.rtnValue,
      AxMessage: resObj.rtnMessage,
      AxTry: resObj.rtnBodyParms.AxTry,
      AxTimeout: resObj.rtnBodyParms.AxTimeout,
      AxClient: resObj.rtnBodyParms.AxClient,
      AxObj: resObj
    }
    if (debugLog) console.log(consoleLogTime(debugModule, 'objRes'), { ...objRes })
    //
    //  Save to array
    //
    arrRes.push(objRes)
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Res', JSON.stringify(arrRes))
  }
  //--------------------------------------------------------------------------------------------
  // Update the transaction ID
  //--------------------------------------------------------------------------------------------
  function updateId() {
    //
    //  Get the store
    //
    const tempJSON = sessionStorage.getItem('App_apiAxios_Id')
    tempJSON ? (g_AxId = JSON.parse(tempJSON)) : (g_AxId = 0)
    g_AxId++
    //
    //  update the store
    //
    sessionStorage.setItem('App_apiAxios_Id', JSON.stringify(g_AxId))
  }
}
