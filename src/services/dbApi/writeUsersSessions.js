//
//  services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/debug/debugSettings'
import consoleLogTime from '@/debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsersSessions'
//===================================================================================
export default function writeUsersSessions() {
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Get User
  //
  const User_User = sessionStorageGet({
    caller: debugModule,
    itemName: 'User_User',
  })
  //
  //  Build row
  //
  const usuid = User_User.u_uid
  const ususer = User_User.u_user
  const usdatetime = new Date().toJSON()
  const AxRow = {
    usuid: usuid,
    usdatetime: usdatetime,
    ususer: ususer,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'userssessions',
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.ruid}) INSERTED in Database`))
    //
    //  Update storage with new row
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Session',
      itemValue: newRow,
    })
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
