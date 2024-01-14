//
//  Utilities
//
import rowCrud from './rowCrud'
//
//  Debug Settings
//
import debugSettings from '../debug/debugSettings'
import consoleLogTime from '../../debug/consoleLogTime'
const debugLog = debugSettings()
const debugModule = 'createOptions'
//...................................................................................
//.  Main Line
//...................................................................................
export default function createOptions(props) {
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const {
    cop_AxTable,
    cop_AxWhere = null,
    cop_owner,
    cop_id,
    cop_title,
    cop_store,
    cop_received
  } = props
  //
  //  Received flag
  //
  sessionStorage.setItem(cop_received, false)
  //
  //  Process promise
  //
  let AxString = `* from ${cop_AxTable} `
  if (cop_AxWhere) AxString = AxString + cop_AxWhere
  const rowCrudparams = {
    AxMethod: 'post',
    AxCaller: debugModule,
    AxTable: cop_AxTable,
    AxAction: 'SELECTSQL',
    AxString: AxString
  }
  const myPromiseGet = rowCrud(rowCrudparams)
  //
  //  Resolve Status
  //
  myPromiseGet.then(function (rtnObj) {
    //
    //  No data returned
    //
    if (!rtnObj.rtnValue) return
    //
    //  Load Options from Data
    //
    const data = rtnObj.rtnRows
    LoadOptions(data, cop_owner, cop_id, cop_title, cop_store, cop_received)
    return
  })
  //
  //  Return Promise
  //
  return myPromiseGet
  //...................................................................................
  //.  Load Options
  //...................................................................................
  function LoadOptions(data, cop_owner, cop_id, cop_title, cop_store, cop_received) {
    //
    //  Options
    //
    let Options = []
    //
    //  No Owner
    //
    if (!cop_owner) {
      data.forEach(item => {
        const itemObj = {
          id: item[cop_id],
          title: item[cop_title]
        }
        Options.push(itemObj)
      })
    }
    //
    //  Owner
    //
    else {
      data.forEach(item => {
        const itemObj = {
          owner: item[cop_owner],
          id: item[cop_id],
          title: item[cop_title]
        }
        Options.push(itemObj)
      })
    }
    //
    //  Store
    //
    sessionStorage.setItem(cop_store, JSON.stringify(Options))
    //
    //  Received flag
    //
    sessionStorage.setItem(cop_received, true)
  }
  //...................................................................................
}
