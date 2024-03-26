//
//  services
//
import apiRowCrud from './apiRowCrud'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsers'
//===================================================================================
export default function writeUsers(params) {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Unpack
  //
  const {
    u_uid,
    u_name,
    u_email,
    u_joined,
    u_fedid,
    u_admin,
    u_showprogress,
    u_showscore,
    u_sortquestions,
    u_skipcorrect,
    u_dftmaxquestions,
    u_fedcountry,
    u_user,
    u_dev,
  } = params
  //
  //  Build row
  //
  const AxRow = {
    u_uid: u_uid,
    u_name: u_name,
    u_email: u_email,
    u_joined: u_joined,
    u_fedid: u_fedid,
    u_admin: u_admin,
    u_showprogress: u_showprogress,
    u_showscore: u_showscore,
    u_sortquestions: u_sortquestions,
    u_skipcorrect: u_skipcorrect,
    u_dftmaxquestions: u_dftmaxquestions,
    u_fedcountry: u_fedcountry,
    u_user: u_user,
    u_dev: u_dev,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'users',
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.u_uid}) INSERTED in Database`))
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
