//
//  Services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import writeUsersSessions from '@/services/dbApi/writeUsersSessions'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'buildDataUser'
//
//  Global Variables
//
let User_Questions = []
let User_Questions_Id = []
let User_Questions_IdString = ''
let User_Bid = []
let User_Hands = []
//...................................................................................
//.  Main Line
//...................................................................................
export default function buildDataUser() {
  debugLog = debugSettings()
  //
  //  Try
  //
  try {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
    //
    //  Allocate a new session
    //
    writeUsersSessions()
    //
    //  Reset the Data
    //

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Questions',
      itemValue: User_Questions,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Questions_Id',
      itemValue: User_Questions_Id,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Bid',
      itemValue: User_Bid,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Hands',
      itemValue: User_Hands,
    })
    //
    //  Load data
    //
    LoadServerQuestions()
  } catch (e) {
    if (debugLog) console.log(consoleLogTime(debugModule, 'Catch'))
    console.log(e)
  }
  //...................................................................................
  //.  Load Server - Questions
  //...................................................................................
  function LoadServerQuestions() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerQuestions'))
    //
    //  SqlString
    //
    const OwnersString = sessionStorageGet({
      caller: debugModule,
      itemName: 'User_OwnersString',
    })
    const SqlString = `* from questions where qowner in (${OwnersString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'SqlString ', SqlString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'questions',
      AxAction: 'SELECTSQL',
      AxString: SqlString,
    }
    const myPromiseQuestions = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseQuestions.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), rtnObj)
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Questions = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Questions ', User_Questions))
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Questions',
        itemValue: User_Questions,
      })
      //
      //  No Questions
      //
      if (!User_Questions[0]) {
        return
      }
      //
      //  Get Qids
      //
      getQid()
      //
      //  Load related
      //
      LoadServerBidding()
      LoadServerHands()
      return
    })

    return
  }
  //...................................................................................
  //.  Output User_Questions
  //...................................................................................
  function getQid() {
    //
    //  Question IDs
    //
    User_Questions_Id = []
    for (let i = 0; i < User_Questions.length; i++) {
      User_Questions_Id.push(User_Questions[i].qqid)
    }
    //
    //  Order by question id
    //
    User_Questions_Id.sort()
    if (debugLog) console.log(consoleLogTime(debugModule, 'User_Questions_Id ', User_Questions_Id))
    //
    //  String version of ID
    //
    User_Questions_IdString = User_Questions_Id.toString()
    if (debugLog)
      console.log(consoleLogTime(debugModule, 'User_Questions_IdString ', User_Questions_IdString))
    //
    //  Session Storage
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Questions_Id',
      itemValue: User_Questions_Id,
    })
  }
  //...................................................................................
  //.  Load Server - Bidding
  //...................................................................................
  function LoadServerBidding() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerBidding'))
    //
    //  Selection
    //
    let AxString = `* from bidding where bqid in (${User_Questions_IdString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString', AxString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'bidding',
      AxAction: 'SELECTSQL',
      AxString: AxString,
    }
    const myPromiseBidding = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseBidding.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), { ...rtnObj })
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Bid = rtnObj.rtnRows
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Bid '), [...User_Bid])
      User_Bid.sort()
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Bid '), [...User_Bid])
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Bid',
        itemValue: User_Bid,
      })
      return
    })
    return
  }
  //...................................................................................
  //.  Load Server - Hands
  //...................................................................................
  function LoadServerHands() {
    if (debugLog) console.log(consoleLogTime(debugModule, 'LoadServerHands'))
    //
    //  Selection
    //
    let AxString = `* from hands where hqid in (${User_Questions_IdString})`
    if (debugLog) console.log(consoleLogTime(debugModule, 'AxString', AxString))
    //
    //  Process promise
    //
    const rowCrudparams = {
      AxMethod: 'post',
      AxCaller: debugModule,
      AxTable: 'hands',
      AxAction: 'SELECTSQL',
      AxString: AxString,
      timeout: null,
    }
    const myPromiseHands = apiRowCrud(rowCrudparams)
    //
    //  Resolve Status
    //
    myPromiseHands.then(function (rtnObj) {
      if (debugLog) console.log(consoleLogTime(debugModule, 'rtnObj '), { ...rtnObj })
      //
      //  Catch Error
      //
      if (rtnObj.rtnCatch) {
        return
      }
      //
      //  No data returned
      //
      if (!rtnObj.rtnValue) return
      //
      //  Data
      //
      User_Hands = rtnObj.rtnRows
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Hands '), [...User_Hands])
      User_Hands.sort()
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Hands '), [...User_Hands])
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Hands',
        itemValue: User_Hands,
      })
      return
    })

    return
  }
}
