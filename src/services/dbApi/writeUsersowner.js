//
//  services
//
import apiRowCrud from './apiRowCrud'
//
//  Debug Settings
//
import debugSettings from '/src/services/debug/debugSettings'
import consoleLogTime from '/src/services/debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsersowner'
//===================================================================================
export default function writeUsersowner(params) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Unpack
  //
  const { uouid, uouser, uoowner } = params
  //
  //  Build row
  //
  const AxRow = {
    uouid: uouid,
    uouser: uouser,
    uoowner: uoowner,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'usersowner',
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.uouid}) INSERTED in Database`))
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
