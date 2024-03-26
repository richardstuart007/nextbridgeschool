//
//  Services
//
import apiRowCrud from '/src//services/dbApi/apiRowCrud'
import writeUsersSessions from '/src//services/dbApi/writeUsersSessions'
import sessionStorageGet from '/src//services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '/src//services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '/src//services/debug/debugSettings'
import consoleLogTime from '/src//services/debug/consoleLogTime'
let debugLog
const debugModule = 'buildDataUser'
//
//  Global Variables
//
let User_Data_Questions = []
let User_Data_Questions_Id = []
let User_Data_Questions_IdString = ''
let User_Data_Bid = []
let User_Data_Hands = []
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
      itemName: 'User_Data_Questions',
      itemValue: User_Data_Questions,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Data_Questions_Id',
      itemValue: User_Data_Questions_Id,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Data_Bid',
      itemValue: User_Data_Bid,
    })

    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Data_Hands',
      itemValue: User_Data_Hands,
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
      User_Data_Questions = rtnObj.rtnRows
      //
      //  Session Storage
      //
      if (debugLog)
        console.log(consoleLogTime(debugModule, 'User_Data_Questions ', User_Data_Questions))
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_Questions',
        itemValue: User_Data_Questions,
      })
      //
      //  No Questions
      //
      if (!User_Data_Questions[0]) {
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
  //.  Output User_Data_Questions
  //...................................................................................
  function getQid() {
    //
    //  Question IDs
    //
    User_Data_Questions_Id = []
    for (let i = 0; i < User_Data_Questions.length; i++) {
      User_Data_Questions_Id.push(User_Data_Questions[i].qqid)
    }
    //
    //  Order by question id
    //
    User_Data_Questions_Id.sort()
    if (debugLog)
      console.log(consoleLogTime(debugModule, 'User_Data_Questions_Id ', User_Data_Questions_Id))
    //
    //  String version of ID
    //
    User_Data_Questions_IdString = User_Data_Questions_Id.toString()
    if (debugLog)
      console.log(
        consoleLogTime(debugModule, 'User_Data_Questions_IdString ', User_Data_Questions_IdString)
      )
    //
    //  Session Storage
    //
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Data_Questions_Id',
      itemValue: User_Data_Questions_Id,
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
    let AxString = `* from bidding where bqid in (${User_Data_Questions_IdString})`
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
      User_Data_Bid = rtnObj.rtnRows
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Data_Bid '), [...User_Data_Bid])
      User_Data_Bid.sort()
      //
      //  Session Storage
      //
      if (debugLog) console.log(consoleLogTime(debugModule, 'User_Data_Bid '), [...User_Data_Bid])
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_Bid',
        itemValue: User_Data_Bid,
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
    let AxString = `* from hands where hqid in (${User_Data_Questions_IdString})`
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
      User_Data_Hands = rtnObj.rtnRows
      if (debugLog)
        console.log(consoleLogTime(debugModule, 'User_Data_Hands '), [...User_Data_Hands])
      User_Data_Hands.sort()
      //
      //  Session Storage
      //
      if (debugLog)
        console.log(consoleLogTime(debugModule, 'User_Data_Hands '), [...User_Data_Hands])
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_Hands',
        itemValue: User_Data_Hands,
      })
      return
    })

    return
  }
}
