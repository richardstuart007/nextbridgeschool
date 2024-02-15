//
//  services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
let debugLog
const debugModule = 'writeSession'
//===================================================================================
export default function writeSession() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Build row
  //
  const usdatetime = new Date().toJSON()
  const AxRow = {
    v_datetime: usdatetime,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'sessions',
    AxRow: AxRow,
  }
  //
  //  Process promise
  //
  const myPromiseInsert = apiRowCrud(props)
  //
  //  Resolve Status
  //
  myPromiseInsert.then(function (rtnObj) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj'), { ...rtnObj })
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Data
    //
    const data = rtnObj.rtnRows
    const newRow = data[0]
    if (debugLog)
      console.log(consoleLogTime(debugModule, `Row (${newRow.v_vid}) INSERTED in Database`))
    //
    //  Update storage with new row
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'App_Session',
      itemValue: newRow,
    })

    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
