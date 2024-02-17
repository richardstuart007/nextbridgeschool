'use client'
//
//  services
//
import apiRowCrud from './apiRowCrud'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'apiCreateOptions'
//...................................................................................
//.  Main Line
//...................................................................................
export default function apiCreateOptions(props) {
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  const {
    cop_AxTable,
    cop_AxWhere = null,
    cop_owner,
    cop_id,
    cop_title,
    cop_store,
    cop_received,
  } = props
  //
  //  Received flag
  //
  sessionStorageSet({
    caller: debugModule,
    itemName: cop_received,
    itemValue: false,
  })
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
    AxString: AxString,
  }
  const myPromiseGet = apiRowCrud(rowCrudparams)
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
          title: item[cop_title],
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
          title: item[cop_title],
        }
        Options.push(itemObj)
      })
    }
    //
    //  Store
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: cop_store,
      itemValue: Options,
    })
    //
    //  Received flag
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: cop_received,
      itemValue: true,
    })
  }
  //...................................................................................
}
