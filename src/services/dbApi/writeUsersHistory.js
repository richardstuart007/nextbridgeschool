//
//  Libraries
//
import { format, parseISO } from 'date-fns'
//
//  services
//
import apiRowCrud from '@/services/dbApi/apiRowCrud'
import sessionStorageGet from '@/services/sessionStorage/sessionStorageGet'
import sessionStorageSet from '@/services/sessionStorage/sessionStorageSet'
//
//  Debug Settings
//
import debugSettings from '@/services/debug/debugSettings'
import consoleLogTime from '@/services/debug/consoleLogTime'
let debugLog
const debugModule = 'writeUsersHistory'
//===================================================================================
export default function writeUsersHistory() {
  //
  //  Debug Settings
  //
  debugLog = debugSettings()
  if (debugLog) console.log(consoleLogTime(debugModule, 'Start'))
  //
  //  Answers
  //
  const r_ans = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_A',
  })
  const r_questions = r_ans.length
  //
  //  If no questions answered, do not write history
  //
  if (r_questions === 0) return
  //
  //  Get User
  //
  const User_User = sessionStorageGet({
    caller: debugModule,
    itemName: 'User_User',
  })
  //
  //  Get History data
  //
  const User_Data_History = sessionStorageGet({
    caller: debugModule,
    itemName: 'User_Data_History',
  })
  //
  //  Get group title
  //
  const Page_Quiz_ogtitle = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_ogtitle',
  })
  //
  //  Key
  //
  const r_uid = User_User.u_uid
  const r_datetime = new Date().toJSON()
  const yymmdd = format(parseISO(r_datetime), 'yy-MM-dd')
  //
  //  Selection Data
  //
  const r_owner = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_Owner',
  })
  const r_group = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_OwnerGroup',
  })
  //
  //  Question IDs of Answered questions
  //
  let r_qid = []
  let r_points = []
  let count = 0
  let r_totalpoints = 0
  let r_maxpoints = 0
  let r_correctpercent = 0

  const Page_Quiz_Q_Flt = sessionStorageGet({
    caller: debugModule,
    itemName: 'Page_Quiz_Q_Flt',
  })
  Page_Quiz_Q_Flt.forEach(row => {
    count++
    if (count <= r_questions) {
      r_qid.push(row.qqid)
      //
      //  Points for each answer (start at 0 not 1)
      //
      const i = count - 1
      const p = r_ans[i] - 1
      const points = row.qpoints[p]
      r_points.push(points)
      //
      //  Total points
      //
      r_totalpoints = r_totalpoints + points
      //
      //  Max points
      //
      r_maxpoints = r_maxpoints + Math.max(...row.qpoints)
    }
  })
  //
  //  Percentage correct
  //
  if (r_maxpoints !== 0) r_correctpercent = Math.ceil((r_totalpoints * 100) / r_maxpoints)
  //
  //  Build row
  //
  const AxRow = {
    r_uid: r_uid,
    r_datetime: r_datetime,
    r_owner: r_owner,
    r_group: r_group,
    r_questions: r_questions,
    r_qid: r_qid,
    r_ans: r_ans,
    r_points: r_points,
    r_maxpoints: r_maxpoints,
    r_totalpoints: r_totalpoints,
    r_correctpercent: r_correctpercent,
  }
  if (debugLog) console.log(consoleLogTime(debugModule, 'AxRow'), { ...AxRow })
  //
  //  Add record to storage (if history already exists)
  //
  if (User_Data_History) {
    const template = User_Data_History[0]
    const newQH = { ...template, ...AxRow }
    newQH.r_hid = 0
    newQH.ogtitle = Page_Quiz_ogtitle
    newQH.yymmdd = yymmdd
    newQH.u_name = User_User.u_name
    if (debugLog) console.log(consoleLogTime(debugModule, 'newQH'), newQH)
    User_Data_History.unshift(newQH)
    sessionStorageSet({
      caller: debugModule,
      itemName: 'User_Data_History',
      itemValue: User_Data_History,
    })
  }
  //
  //  Build Props
  //
  const props = {
    AxCaller: debugModule,
    AxMethod: 'post',
    AxAction: 'INSERT',
    AxTable: 'usershistory',
    AxRow: AxRow,
    timeout: 1500,
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
      console.log(consoleLogTime(debugModule, `Row (${newRow.r_hid}) INSERTED in Database`))
    //
    //  Update storage with r_hid
    //
    if (User_Data_History) {
      User_Data_History[0].r_hid = newRow.r_hid
      sessionStorageSet({
        caller: debugModule,
        itemName: 'User_Data_History',
        itemValue: User_Data_History,
      })
    }
    return
  })
  //
  //  Return Promise
  //
  return myPromiseInsert
}
